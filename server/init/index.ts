import e from "express";
import { decodeURI, initDBConnect, initSession, initUser, /* serverLog */ } from "./init";

const init = (expressApp: e.Express) => {
  expressApp.use(decodeURI);
  expressApp.use(initDBConnect);
  expressApp.use(initSession);
  // expressApp.use(serverLog);
  expressApp.use(initUser);
};

export { init };
