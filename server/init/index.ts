import type { Express } from "express";
import { decodeURI, initDBConnect, initSession, initUser } from "./init";

const init = (expressApp: Express) => {
  expressApp.use(decodeURI);
  expressApp.use(initDBConnect);
  expressApp.use(initSession);
  expressApp.use(initUser);
};

export { init };
