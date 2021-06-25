import { log } from "utils/log";
import { accessApi } from "config/api";
import { ServerError } from "server/utils/error";
import { TransformHandlerType } from "types/server";
import { catchHandler, fail, transformHandler } from "server/middleware/apiHandler";

const generateToken: TransformHandlerType = transformHandler(
  catchHandler(
    ({ req, res, next }) => {
      if (!req.session) {
        throw new ServerError("session not generate!", 500);
      }
      if (!req.cookies.apiToken || !req.session.apiToken || req.cookies.apiToken !== req.session.apiToken) {
        const currentToken = process.env.NEXT_PUBLIC_APITOKEN + Math.random().toString(16).slice(2);
        req.session.apiToken = currentToken;
        res.cookie("apiToken", currentToken, { expires: new Date(Date.now() + 60 * 60000), encode: String });
      }
      next();
    },
    ({ res, e, code = 500 }) =>
      fail({ res, statuCode: code, resDate: { code: -1, state: "初始化失败", data: `token生成失败：${e.toString()}`, methodName: "generateToken" } })
  )
);

const detectionToken: TransformHandlerType = transformHandler(
  catchHandler(({ req, next }) => {
    if (!req.session) {
      throw new ServerError("session not generate!", 500);
    }
    const path = req.path.slice(1);
    if (accessApi[path]) {
      const { disable = false, token = true, method = "get", config = {} } = accessApi[path];
      // 挂载config
      req.config = config;
      if (disable) {
        throw new ServerError("路径不存在", 404);
      }
      if (method.toLowerCase() !== req.method.toLowerCase()) {
        throw new ServerError(`方法不支持: ${req.method.toLowerCase()}`, 405);
      }
      if (token && req.headers.apitoken !== req.session.apiToken) {
        throw new ServerError(`token检测失败, client: ${req.headers.apitoken} -- server: ${req.session.apiToken}`, 401);
      }
      next();
    } else {
      // 未配置api访问检测
      log(`this api request not set yet: ${path}`, "warn");
      if (process.env.NODE_ENV !== "production") {
        req.config = {};
        next();
      } else {
        throw new ServerError("访问路径不存在", 404);
      }
    }
  })
);

export { generateToken, detectionToken };
