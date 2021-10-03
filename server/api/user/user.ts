import { ServerError } from "server/utils/error";
import { createRequest } from "utils/fetcher";
import { insertUser } from "server/database/insert";
import { getAuthorByUserId, getUserByUser, getUserByUserId, getUserByUserName, getUsersExByUserId } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { IpAddressProps } from "types/hook";

// 用户登录请求
const loginAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
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
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { state: "登录失败", data: e.toString(), methodName: "loginAction" } }),
  paramsConfig: { fromBody: ["username", "password"] },
  checkCodeConfig: { needCheck: true },
});

// 自动登录请求
const autoLoginAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    if (req.user) {
      success({ res, resDate: { state: "自动登录成功", data: req.user } });
    } else {
      fail({ res, statusCode: 200, resDate: { state: "自动登录失败" } });
    }
  },
});

const autoGetIp = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const request = createRequest({ path: process.env.NEXT_PUBLIC_IPADDRESS, header: req.headers, data: req.body });
    await request
      .run<IpAddressProps>()
      .then((data) => success({ res, resDate: { data } }))
      .catch((e) => fail({ res, resDate: { data: e.toString() } }));
  },
});

// 登出请求
const logoutAction = autoRequestHandler({
  requestHandler: async ({ res }) => {
    res.clearCookie("id");
    success({ res, resDate: { state: "登出成功" } });
  },
});

// 注册请求
const registerAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    if (!req.body) {
      throw new ServerError("注册参数不存在", 400);
    }
    const data = await insertUser({ db: req.db!, ...req.body });
    success({ res, resDate: { state: "注册成功", data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { state: "注册失败", data: e.toString(), methodName: "registerAction" } }),
});

// 获取用户点赞相关数据
const getUserExByUserIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const userId = req.query.userId as string;
    const data = await getUsersExByUserId({ userId, db: req.db! });
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { data: e.toString(), methodName: "getUserExByUserIdAction" } }),
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userId"] },
});

// 根据id获取用户详细数据
const getUserByUserIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    if (req.query.userId === undefined) {
      throw new ServerError("查询用户信息不存在", 400);
    }
    const userId = req.query.userId as string;
    const data = await getUserByUserId({ db: req.db!, userId });
    success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { data: e.toString(), methodName: "getUserByUserIdAction" } }),
});

const getUserByUserNameAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const userName = req.query.userName as string;
    const data = await getUserByUserName({ db: req.db!, userName: userName });
    success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { data: e.toString(), methodName: "getUserByUserNameAction" } }),
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userName"] },
});

const getAuthorByUserIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { userId } = req.query;
    const data = await getAuthorByUserId({ db: req.db!, userId: userId as string });
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statusCode: code, resDate: { state: "获取失败", data: e.toString() }, methodName: "getAuthorByUserIdAction" }),
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["userId"] },
});

export {
  loginAction,
  logoutAction,
  autoLoginAction,
  autoGetIp,
  registerAction,
  getUserByUserIdAction,
  getUserExByUserIdAction,
  getAuthorByUserIdAction,
  getUserByUserNameAction,
};
