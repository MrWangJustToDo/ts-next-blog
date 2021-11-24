// 用户信息的操作
import { apiName } from "config/api";
import {
  autoLoginAction,
  loginAction,
  logoutAction,
  registerAction,
  getUserExByUserIdAction,
  getUserByUserIdAction,
  getUserByUserNameAction,
  getAuthorByUserIdAction,
} from "./user";

const userHandler = {
  [apiName.login]: loginAction,
  [apiName.logout]: logoutAction,
  [apiName.register]: registerAction,
  [apiName.autoLogin]: autoLoginAction,
  [apiName.user]: getUserByUserIdAction,
  [apiName.userName]: getUserByUserNameAction,
  [apiName.userEx]: getUserExByUserIdAction,
  [apiName.author]: getAuthorByUserIdAction,
};

export { userHandler };
