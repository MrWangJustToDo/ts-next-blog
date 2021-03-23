import * as sqlite from "sqlite";
import sqlite3 from "sqlite3";
import { log } from "utils/log";
import { TransformHandlerType } from "types/server";
import { catchHandler, fail, transformHandler } from "server/middleware/apiHandler";

let initDBConnect: TransformHandlerType;

let initSession: TransformHandlerType;

let decodeURI: TransformHandlerType;

let serverLog: TransformHandlerType;

let initUser: TransformHandlerType;

var db: sqlite.Database;

initDBConnect = transformHandler(
  catchHandler(
    async ({ req, next }) => {
      if (!db) {
        db = await sqlite.open({
          filename: process.env.DATABASE as string,
          driver: sqlite3.Database,
        });
      }
      if (!req.db!) {
        req.db! = db;
      }
      next();
    },
    ({ res, e, code = 500 }) =>
      fail({ res, statuCode: code, resDate: { code: -1, state: "初始化失败", data: `数据库连接失败：${e.toString()}`, methodName: "initDBConnect" } })
  )
);

initSession = transformHandler(
  catchHandler(
    ({ req, next }) => {
      if (!req.session.views) {
        req.session.views = {};
      }
      next();
    },
    ({ res, e, code = 500 }) =>
      fail({ res, statuCode: code, resDate: { code: -1, state: "初始化失败", data: `session初始化失败：${e.toString()}`, methodName: "initSession" } })
  )
);

decodeURI = transformHandler(
  catchHandler(({ req, next }) => {
    req.url = decodeURIComponent(req.url);
    next();
  })
);

serverLog = transformHandler(
  catchHandler(({ req, next }) => {
    if (!req.url.startsWith("/_next") && !req.url.startsWith("/__next")) {
      log(`method: ${req.method} request url: ${req.url}`, "normal");
    }
    next();
  })
);

export { initDBConnect, initSession, initUser, decodeURI, serverLog };
