import * as sqlite from "sqlite";
import sqlite3 from "sqlite3";
import { getUserByUserId } from "server/database/get";
import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

let db: sqlite.Database;

const initDBConnect = wrapperMiddlewareRequest(
  {
    requestHandler: async function initDBConnect({ req }) {
      if (!db) {
        db = await sqlite.open({
          filename: process.env.DATABASE as string,
          driver: sqlite3.Database,
        });
      }
      if (!req.db) {
        req.db = db;
      }
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

const initSession = wrapperMiddlewareRequest(
  {
    requestHandler: function initSession({ req }) {
      if (!req.session.views) {
        req.session.views = {};
      }
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

const decodeURI = wrapperMiddlewareRequest(
  {
    requestHandler: function decodeURI({ req }) {
      req.url = decodeURIComponent(req.url);
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

const initUser = wrapperMiddlewareRequest(
  {
    requestHandler: async function initUser({ req }) {
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
    },
    goNext: true,
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

export { initDBConnect, initSession, initUser, decodeURI };
