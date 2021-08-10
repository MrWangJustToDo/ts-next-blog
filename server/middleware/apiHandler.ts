import assign from "lodash/assign";
import { log } from "utils/log";
import { Cache } from "utils/cache";
import { ServerError } from "server/utils/error";
import { NextFunction, Request, Response } from "express";
import {
  ApiResponseData,
  ApiResponseProps,
  AutoRequestHandlerProps,
  CacheConfigProps,
  ErrorHandlerType,
  RequestHandlerProps,
  UserConfigProps,
  RequestHandlerType,
  ExpressRequest,
  CheckCodeConfigProps,
  // CheckParamsConfigProps,
  AutoRequestHandlerMiddlewareProps,
  MiddlewareRequestHandlerType,
} from "types/server";

const cache = new Cache<string, any>();

const success = <T>({ res, statuCode = 200, resDate }: ApiResponseProps<T>): ApiResponseData<T> | void => {
  resDate.code = resDate.code || 0;
  resDate.state = resDate.state || "获取成功";
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
  return resDate;
};

const fail = <T>({ res, statuCode = 404, resDate, methodName }: ApiResponseProps<T> & { methodName?: string }): void => {
  if (methodName && process.env.NODE_ENV === "development") {
    resDate["methodName"] = `method: ${methodName} 出现错误`;
  } else {
    delete resDate["methodName"];
  }
  resDate.code = resDate.code || -1;
  resDate.state = resDate.state || "获取失败";
  resDate.time = new Date().toLocaleString();
  res.status(statuCode).json(resDate);
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
      log(e, "error");
      if (errorHandler && typeof errorHandler === "function") {
        if (e instanceof ServerError) {
          await errorHandler({ req, res, next, e, code: e.code, cache });
        } else {
          await errorHandler({ req, res, next, e, code: 404, cache });
        }
      } else {
        fail({ res, resDate: { state: "访问失败", data: e.toString() } });
      }
    }
  };
};

const catchMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { req, res, next, errorHandler } = ctx;
  try {
    return await nextMiddleware();
  } catch (e) {
    log(e, "error");
    if (errorHandler && typeof errorHandler === "function") {
      if (e instanceof ServerError) {
        await errorHandler({ req, res, next, e, code: e.code, cache });
      } else {
        await errorHandler({ req, res, next, e, code: 404, cache });
      }
    } else {
      fail({ res, resDate: { state: "访问失败", data: e.toString() } });
    }
  }
};

const cacheHandler = (requestHandler: RequestHandlerType, time: number | undefined, cacheConfig: CacheConfigProps) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    const currentCacheConfig = assign(cacheConfig, req.config?.cache);
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
        const actionValue = await requestHandler({ req, res, next, cache });
        if (!!actionValue) {
          cache.set(key, actionValue, cacheTime);
        } else {
          log(`nothing to return, so nothing to cache. method: ${req.method}, url: ${req.originalUrl}`, "warn");
        }
      }
    } else {
      return await requestHandler({ req, res, next, cache });
    }
  };
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
      if (!!actionValue) {
        cache.set(key, actionValue, cacheTime);
      } else {
        log(`nothing to return, so nothing to cache. method: ${req.method}, url: ${req.originalUrl}`, "warn");
      }
    }
  } else {
    return await nextMiddleware();
  }
};

const checkcodeHandler = (requestHandler: RequestHandlerType, check: boolean | undefined, checkCodeConfig: CheckCodeConfigProps) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    const currentCheckCodeConfig = assign(checkCodeConfig, req.config?.check);
    const needCheck = currentCheckCodeConfig.needCheck ? currentCheckCodeConfig.needCheck : check;
    const fieldName = currentCheckCodeConfig.fieldName || "checkCode";
    const fromQuery = currentCheckCodeConfig.fromQuery;
    if (needCheck) {
      if (fromQuery) {
        const checkCode = req.query[fieldName];
        if (checkCode !== req.session.captcha) {
          throw new ServerError("验证码不正确", 400);
        }
      } else {
        const checkCode = req.body[fieldName];
        if (checkCode !== req.session.captcha) {
          throw new ServerError("验证码不正确", 400);
        }
      }
    }
    return await requestHandler({ req, res, next, cache });
  };
};

const checkcodeMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { req, checkCodeConfig, check } = ctx;
  const currentCheckCodeConfig = assign({}, checkCodeConfig, req.config?.check);
  const needCheck = currentCheckCodeConfig.needCheck ? currentCheckCodeConfig.needCheck : check;
  const fieldName = currentCheckCodeConfig.fieldName || "checkCode";
  const fromQuery = currentCheckCodeConfig.fromQuery;
  if (needCheck) {
    if (fromQuery) {
      const checkCode = req.query[fieldName];
      if (checkCode !== req.session.captcha) {
        throw new ServerError("验证码不正确", 400);
      }
    } else {
      const checkCode = req.body[fieldName];
      if (checkCode !== req.session.captcha) {
        throw new ServerError("验证码不正确", 400);
      }
    }
  }
  return await nextMiddleware();
};

/*
const checkParamsHandler = (requestHandler: RequestHandlerType, checkParamsConfig: CheckParamsConfigProps) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    const currentCheckParamsConfig = assign(checkParamsConfig, req.config?.params);
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
    return await requestHandler({ req, res, next, cache });
  };
};
*/

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
  return await nextMiddleware();
};

const decodeMiddlewareHandler = async (ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => {
  const { req, encodeConfig } = ctx;
  const currentEncodeConfig = encodeConfig || req.config?.encode;
  if (currentEncodeConfig) {
    if (typeof req.body.encode === "undefined") {
      throw new ServerError("当前请求体格式不正确", 400);
    } else {
      req.body = JSON.parse(Buffer.from(req.body["encode"], "base64").toString());
    }
  }
  return await nextMiddleware();
};

const userHandler = (requestHandler: RequestHandlerType, strict: boolean | undefined, userConfig: UserConfigProps) => {
  return async ({ req, res, next }: RequestHandlerProps) => {
    const currentUserConfig = assign(userConfig, req.config?.user);
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
      return await requestHandler({ req, res, next, cache });
    } else {
      return await requestHandler({ req, res, next, cache });
    }
  };
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
    return await nextMiddleware();
  } else {
    return await nextMiddleware();
  }
};

// 这个函数不够优雅  参考中间件组合函数进行组合
/*
const autoRequestHandler = ({
  requestHandler,
  errorHandler,
  strict,
  time,
  check,
  cacheConfig,
  userConfig,
  checkCodeConfig,
  paramsConfig,
}: AutoRequestHandlerProps) => {
  return transformHandler(
    catchHandler(
      checkParamsHandler(
        checkcodeHandler(userHandler(cacheHandler(requestHandler, time, cacheConfig || {}), strict, userConfig || {}), check, checkCodeConfig || {}),
        paramsConfig || {}
      ),
      errorHandler
    )
  );
};
*/

const compose = (...middlewares: ((ctx: AutoRequestHandlerMiddlewareProps, nextMiddleware: MiddlewareRequestHandlerType) => Promise<any | void>)[]) => {
  return function (ctx: AutoRequestHandlerMiddlewareProps, next: RequestHandlerType) {
    let index = -1;
    function dispatch(i: number): Promise<any> {
      if (i <= index) {
        throw new ServerError("compose index error", 500);
      }
      index = i;
      const fn = middlewares[i] || next;
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

const autoRequestHandler = (config: AutoRequestHandlerProps) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ctx = { ...config, req, res, next, cache };
    const fn = compose(
      catchMiddlewareHandler,
      decodeMiddlewareHandler,
      checkParamsMiddlewareHandler,
      checkcodeMiddlewareHandler,
      userMiddlewareHandler,
      cacheMiddlewareHandler
    );
    return await fn(ctx, ctx.requestHandler || next);
  };
};

export { success, fail, transformHandler, catchHandler, cacheHandler, checkcodeHandler, userHandler, autoRequestHandler };
