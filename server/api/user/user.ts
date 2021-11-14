import { ServerError } from "server/utils/error";
import { createRequest } from "utils/fetcher";
import { insertUser } from "server/database/insert";
import { getAuthorByUserId, getUserByUser, getUserByUserId, getUserByUserName, getUsersExByUserId } from "server/database/get";
import { success, fail, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import type { IpAddressProps } from "types";

// 用户登录请求
export const loginAction = wrapperMiddlewareRequest({
  requestHandler: async function loginAction({ req, res }) {
    const body = req.body;
    const user = await getUserByUser({
      username: body.username,
      password: body.password,
      db: req.db!,
    });
    if (!user) {
      throw new ServerError("用户信息验证失败", 401);
    }
    res.cookie("id", user.userId, {
      maxAge: 8640000,
      signed: true,
    });
    success({ res, resDate: { state: "登录成功", data: user } });
  },
  paramsConfig: { fromBody: ["username", "password"] },
  checkCodeConfig: { needCheck: true },
});

// 自动登录请求
export const autoLoginAction = wrapperMiddlewareRequest({
  requestHandler: async function autoLoginAction({ req, res }) {
    if (req.user) {
      success({ res, resDate: { state: "自动登录成功", data: req.user } });
    } else {
      fail({ res, statusCode: 200, resDate: { state: "自动登录失败" } });
    }
  },
});

export const autoGetIp = wrapperMiddlewareRequest({
  requestHandler: async function autoGetIp({ req, res }) {
    const request = createRequest({ path: process.env.NEXT_PUBLIC_IPADDRESS, header: req.headers, data: req.body });
    await request
      .run<IpAddressProps>()
      .then((data) => success({ res, resDate: { data } }))
      .catch((e) => fail({ res, resDate: { data: e.toString() } }));
  },
});

// 登出请求
export const logoutAction = wrapperMiddlewareRequest({
  requestHandler: async function logoutAction({ res }) {
    res.clearCookie("id");
    success({ res, resDate: { state: "登出成功" } });
  },
});

// 注册请求
export const registerAction = wrapperMiddlewareRequest({
  requestHandler: async function registerAction({ req, res }) {
    if (!req.body) {
      throw new ServerError("注册参数不存在", 400);
    }
    const data = await insertUser({ db: req.db!, ...req.body });
    success({ res, resDate: { state: "注册成功", data } });
  },
});

// 获取用户点赞相关数据
export const getUserExByUserIdAction = wrapperMiddlewareRequest({
  requestHandler: async function getUserExByUserIdAction({ req, res }) {
    const userId = req.query.userId as string;
    const data = await getUsersExByUserId({ userId, db: req.db! });
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userId"] },
});

// 根据id获取用户详细数据
export const getUserByUserIdAction = wrapperMiddlewareRequest({
  requestHandler: async function getUserByUserIdAction({ req, res }) {
    const userId = req.query.userId as string;
    const data = await getUserByUserId({ db: req.db!, userId });
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userId"] },
});

export const getUserByUserNameAction = wrapperMiddlewareRequest({
  requestHandler: async function getUserByUserNameAction({ req, res }) {
    const userName = req.query.userName as string;
    const data = await getUserByUserName({ db: req.db!, userName: userName });
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userName"] },
});

export const getAuthorByUserIdAction = wrapperMiddlewareRequest({
  requestHandler: async function getAuthorByUserIdAction({ req, res }) {
    const { userId } = req.query;
    const data = await getAuthorByUserId({ db: req.db!, userId: userId as string });
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userId"] },
});
