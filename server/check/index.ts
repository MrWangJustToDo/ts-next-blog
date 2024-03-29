import { log } from "utils/log";
import { accessApi } from "config/api";
import { ServerError } from "server/utils/error";
import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

export const generateToken = wrapperMiddlewareRequest(
  {
    requestHandler: function generateToken({ req, res }) {
      if (!req.session) {
        throw new ServerError("session not generate!", 500);
      }
      if (!req.cookies.apiToken || !req.session.apiToken || req.cookies.apiToken !== req.session.apiToken) {
        const currentToken = process.env.NEXT_PUBLIC_API_TOKEN + Math.random().toString(16).slice(2);
        req.session.apiToken = currentToken;
        res.cookie("apiToken", currentToken, { expires: new Date(Date.now() + 60 * 60000), encode: String });
      }
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

export const detectionToken = wrapperMiddlewareRequest(
  {
    requestHandler: function detectionToken({ req }) {
      if (!req.session) {
        throw new ServerError("session not generate!", 500);
      }
      const path = req.path.slice(1);
      if (accessApi[path]) {
        const { disable = false, token = true, method, config = {} } = accessApi[path];
        // 挂载config
        req.config = config;
        if (disable) {
          throw new ServerError("路径不存在", 404);
        }
        if (method && method.toLowerCase() !== req.method.toLowerCase()) {
          throw new ServerError(`方法不支持: ${req.method.toLowerCase()}`, 405);
        }
        if (token && req.headers.apitoken !== req.session.apiToken) {
          throw new ServerError(`token检测失败, client: ${req.headers.apitoken} -- server: ${req.session.apiToken}`, 401);
        }
      } else {
        // 未配置api访问检测
        log(`this api request not set yet: ${path}`, "warn");
        if (process.env.NODE_ENV !== "production") {
          req.config = {};
        } else {
          throw new ServerError("访问路径不存在", 404);
        }
      }
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);
