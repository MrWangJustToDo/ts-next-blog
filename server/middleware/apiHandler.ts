import assign from "lodash/assign";
import chalk from "chalk";
import { log } from "utils/log";
import { Cache } from "utils/cache";
import { ServerError } from "server/utils/error";
import { NextFunction, Request, Response } from "express";
import {
  ApiResponseData,
  ApiResponseProps,
  AutoRequestHandlerProps,
  ErrorHandlerType,
  RequestHandlerProps,
  RequestHandlerType,
  ExpressRequest,
  AutoRequestHandlerMiddlewareProps,
  MiddlewareRequestHandlerType,
} from "types/server";

const cache = new Cache<string, any>();

let currentResponseDate: null | any = null;

const success = <T>({ res, statusCode = 200, resDate }: ApiResponseProps<T>): ApiResponseData<T> | void => {
  // 缓存当前成功的请求数据
  currentResponseDate = resDate;
  resDate.code = resDate.code || 0;
  resDate.state = resDate.state || "获取成功";
  resDate.time = new Date().toLocaleString();
  res.status(statusCode).json(resDate);
};

const fail = <T>({ res, statusCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (methodName && process.env.NODE_ENV === "development") {
    resDate["methodName"] = `method: ${methodName} 出现错误`;
  } else {
    delete resDate["methodName"];
  }
  resDate.code = resDate.code || -1;
  resDate.state = resDate.state || "获取失败";
  resDate.time = new Date().toLocaleString();
  res.status(statusCode).json(resDate);
};

const transformHandler = (requestHandler: RequestHandlerType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    return await requestHandler({ req, res, next, cache });
  };
};

const catchHandler = (requestHandler: RequestHandlerType, errorHandler?: ErrorHandlerType) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    try {
      return await requestHandler({ req, res, next, cache });
    } catch (e) {
      log(e as Error, "error");
      if (errorHandler && typeof errorHandler === "function") {
        if (e instanceof ServerError) {
          await errorHandler({ req, res, next, e, code: e.code, cache });
        } else if (e instanceof Error) {
          await errorHandler({ req, res, next, e, code: 404, cache });
        }
      } else {
        fail({ res, resDate: { state: "访问失败", data: (e as Error).toString() } });
      }
    }
  };
};

const catchMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { req, res, next, errorHandler } = ctx;
  try {
    await nextMiddleware();
  } catch (e) {
    log(e as Error, "error");
    if (errorHandler && typeof errorHandler === "function") {
      if (e instanceof ServerError) {
        await errorHandler({ req, res, next, e, code: e.code, cache });
      } else if (e instanceof Error) {
        await errorHandler({ req, res, next, e, code: 404, cache });
      }
    } else {
      fail({ res, resDate: { state: "访问失败", data: (e as Error).toString() } });
    }
  }
};

const cacheMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { cacheConfig, cache, req, res, time } = ctx;
  const currentCacheConfig = assign({}, cacheConfig, req.config?.cache);
  const key = currentCacheConfig.cacheKey
    ? typeof currentCacheConfig.cacheKey === "function"
      ? currentCacheConfig.cacheKey({ req })
      : currentCacheConfig.cacheKey
    : req.originalUrl;

  const needCache = currentCacheConfig.needCache;
  const cacheTime = currentCacheConfig.cacheTime ? currentCacheConfig.cacheTime : time;
  const needDelete = currentCacheConfig.needDelete;
  if (needDelete) {
    if (Array.isArray(needDelete)) {
      needDelete.forEach((item: string | (({ req }: { req: ExpressRequest }) => string | string[])) => {
        if (typeof item === "function") {
          const key = item({ req });
          if (Array.isArray(key)) {
            key.forEach((i) => cache.deleteRightNow(i));
          } else {
            cache.deleteRightNow(key);
          }
        } else {
          cache.deleteRightNow(item);
        }
      });
    } else if (typeof needDelete === "string") {
      cache.deleteRightNow(needDelete);
    } else if (needDelete === true) {
      cache.deleteRightNow(key);
    } else {
      const key = needDelete({ req });
      if (Array.isArray(key)) {
        key.forEach((i) => cache.deleteRightNow(i));
      } else {
        cache.deleteRightNow(key);
      }
    }
  }
  if (needCache) {
    const cacheValue = cache.get(key);
    if (cacheValue) {
      log(`get response data from cache. method: ${req.method}, url: ${req.originalUrl}, key: ${key}`, "normal");
      success({ res, resDate: cacheValue });
    } else {
      const actionValue = await nextMiddleware();
      const currentActionValue = actionValue || currentResponseDate;
      if (!!currentActionValue) {
        cache.set(key, currentActionValue, cacheTime);
      } else {
        log(`nothing to return, so nothing to cache. method: ${req.method}, url: ${req.originalUrl}`, "warn");
      }
    }
  } else {
    await nextMiddleware();
  }
};

const checkCodeMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { req, checkCodeConfig, check } = ctx;
  const currentCheckCodeConfig = assign({}, checkCodeConfig, req.config?.check);
  const needCheck = currentCheckCodeConfig.needCheck ? currentCheckCodeConfig.needCheck : check;
  const fieldName = currentCheckCodeConfig.fieldName || "checkCode";
  const fromQuery = currentCheckCodeConfig.fromQuery;
  if (needCheck) {
    if (fromQuery) {
      const checkCode = req.query[fieldName];
      if (!checkCode) {
        throw new ServerError(`请求参数不存在: ${fieldName}`, 400);
      }
      if (checkCode !== req.session.captcha) {
        throw new ServerError("验证码不正确  query", 400);
      }
    } else {
      const checkCode = req.body[fieldName];
      if (!checkCode) {
        throw new ServerError(`请求参数不存在: ${fieldName}`, 400);
      }
      if (checkCode !== req.session.captcha) {
        throw new ServerError("验证码不正确  body", 400);
      }
    }
  }
  await nextMiddleware();
};

const checkParamsMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { paramsConfig, req } = ctx;
  const currentCheckParamsConfig = assign({}, paramsConfig, req.config?.params);
  const currentFromQuery = currentCheckParamsConfig.fromQuery;
  const currentFromBody = currentCheckParamsConfig.fromBody;
  if (currentFromBody && currentFromBody.length > 0) {
    for (let i = 0; i < currentFromBody.length; i++) {
      if (req.body[currentFromBody[i]] === undefined) {
        throw new ServerError(`请求参数错误, body: ${currentFromBody[i]}`, 403);
      }
    }
  }
  if (currentFromQuery && currentFromQuery.length > 0) {
    for (let i = 0; i < currentFromQuery.length; i++) {
      if (req.query[currentFromQuery[i]] === undefined) {
        throw new ServerError(`请求参数错误, query: ${currentFromQuery[i]}`, 403);
      }
    }
  }
  await nextMiddleware();
};

const decodeMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { req, encodeConfig } = ctx;
  const currentEncodeConfig = encodeConfig || req.config?.encode;
  if (currentEncodeConfig) {
    if (typeof req.body.encode === "undefined") {
      throw new ServerError("当前请求体格式不正确", 400);
    } else {
      let encodeBodyString = req.body["encode"].toString() as string;
      if (process.env) {
        if (encodeBodyString.endsWith(process.env.NEXT_PUBLIC_STRING as string)) {
          encodeBodyString = encodeBodyString.slice(0, -(process.env.NEXT_PUBLIC_STRING || "").length);
        }
      }
      const bodyString = Buffer.from(encodeBodyString, "base64").toString();
      req.body = JSON.parse(bodyString);
    }
  }
  await nextMiddleware();
};

const userMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { userConfig, req, strict } = ctx;
  const currentUserConfig = assign({}, userConfig, req.config?.user);
  const needCheck = currentUserConfig.needCheck;
  const checkStrict = currentUserConfig.checkStrict ? currentUserConfig.checkStrict : strict;
  if (needCheck) {
    if (!req.user) {
      throw new ServerError("未登录，拒绝访问", 400);
    }
    if (checkStrict) {
      if (req.user.userId !== req.query.userId) {
        throw new ServerError("登录用户与操作用户不一致", 401);
      }
    }
    await nextMiddleware();
  } else {
    await nextMiddleware();
  }
};

const logMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const url = ctx.req.url;
  const method = ctx.req.method;
  const key =  chalk.redBright("[time log] url: " + url + ", method: " + method);
  console.time(key);
  await nextMiddleware();
  console.timeEnd(key);
};

const compose = (...middleWares: ((ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => Promise<any | void>)[]) => {
  return function (ctx: AutoRequestHandlerMiddlewareProps, next: RequestHandlerType) {
    let runTime = 0;
    let index = -1;
    // 需要加上死循环判断
    function dispatch(i: number): Promise<any> {
      if (i <= index) {
        // 这些错误将会被 catchMiddlewareHandler  进行捕获
        throw new ServerError("compose index error, every middleware only allow call once", 500);
      }
      // 防止中间件死循环
      runTime++;
      if (runTime > middleWares.length + 5) {
        throw new ServerError("call middleWare many times, look like a infinite loop and will stop call next", 500);
      }
      index = i;
      const fn = middleWares[i] || next;
      if (fn) {
        try {
          return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
        } catch (e) {
          log("compose catch error", "error");
          return Promise.resolve(e);
        }
      } else {
        log("all middleware done, do not call next", "warn");
        return Promise.resolve();
      }
    }
    return dispatch(0);
  };
};

const composedHandler = compose(
  logMiddlewareHandler,
  catchMiddlewareHandler,
  decodeMiddlewareHandler,
  checkParamsMiddlewareHandler,
  checkCodeMiddlewareHandler,
  userMiddlewareHandler,
  cacheMiddlewareHandler
);

const autoRequestHandler = (config: AutoRequestHandlerProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 每一个新的请求  需要清除原始的缓存数据
    currentResponseDate = null;
    const ctx = { ...config, req, res, next, cache };
    try {
      return await composedHandler(ctx, ctx.requestHandler || next);
    } catch (e) {
      fail({ res, statusCode: 500, resDate: { data: (e as Error).toString(), methodName: "composedHandler" } });
    }
  };
};

export { success, fail, transformHandler, catchHandler, autoRequestHandler };
