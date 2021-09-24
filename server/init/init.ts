import * as sqlite from "sqlite";
import sqlite3 from "sqlite3";
import { log } from "utils/log";
import { getUserByUserId } from "server/database/get";
import { catchHandler, fail, transformHandler } from "server/middleware/apiHandler";
import { TransformHandlerType } from "types/server";

var db: sqlite.Database;

const initDBConnect: TransformHandlerType = transformHandler(
  catchHandler(
    async ({ req, next }) => {
      if (!db) {
        db = await sqlite.open({
          filename: process.env.DATABASE as string,
          driver: sqlite3.Database,
        });
      }
      if (!req.db) {
        req.db = db;
      }
      next();
    },
    ({ res, e, code = 500 }) =>
      fail({ res, statusCode: code, resDate: { code: -1, state: "初始化失败", data: `数据库连接失败：${e.toString()}`, methodName: "initDBConnect" } })
  )
);

const initSession: TransformHandlerType = transformHandler(
  catchHandler(
    ({ req, next }) => {
      if (!req.session.views) {
        req.session.views = {};
      }
      next();
    },
    ({ res, e, code = 500 }) =>
      fail({ res, statusCode: code, resDate: { code: -1, state: "初始化失败", data: `session初始化失败：${e.toString()}`, methodName: "initSession" } })
  )
);

const decodeURI: TransformHandlerType = transformHandler(
  catchHandler(({ req, next }) => {
    req.url = decodeURIComponent(req.url);
    next();
  })
);

const serverLog: TransformHandlerType = transformHandler(
  catchHandler(({ req, next }) => {
    if (!req.url.startsWith("/_next") && !req.url.startsWith("/__next")) {
      log(`method: ${req.method}, request url: ${req.url}`, "normal");
    }
    next();
  })
);

const initUser: TransformHandlerType = transformHandler(
  catchHandler(
    async ({ req, next }) => {
      // 从签名cookie中找出该用户的信息并挂在req对象上以供后续的中间件访问
      if (req.signedCookies.id) {
        // 从session中找登录信息
        if (req.session.userCache) {
          req.user = req.session.userCache;
        }
        if (!req.user) {
          req.user = await getUserByUserId({
            userId: req.signedCookies.id,
            db: req.db!,
          });
          req.session.userCache = req.user;
        }
      } else {
        req.session.userCache = null;
      }
      next();
    },
    ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { state: "初始化用户信息失败", data: e.toString(), methodName: "initUser" } })
  )
);

export { initDBConnect, initSession, initUser, decodeURI, serverLog };
