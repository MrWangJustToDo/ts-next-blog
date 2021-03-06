// 用户信息的操作
import { apiName } from "config/api";
import {
  autoLoginAction,
  loginAction,
  logoutAction,
  registerAction,
  getUserExByUserIdAction,
  getUserByUserIdAction,
  getAuthorByUserIdAction,
  autoGetIp,
} from "./user";

const userHandler = {
  [apiName.login]: loginAction,
  [apiName.logout]: logoutAction,
  [apiName.register]: registerAction,
  [apiName.autoLogin]: autoLoginAction,
  [apiName.user]: getUserByUserIdAction,
  [apiName.userEx]: getUserExByUserIdAction,
  [apiName.author]: getAuthorByUserIdAction,
  [apiName.ip]: autoGetIp,
};

export { userHandler };
