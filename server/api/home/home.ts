import { getHome } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";

// 获取首页数据
const getHomeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const data = await getHome({ db: req.db! });
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getHomeAction" } }),
  cacheConfig: { needCache: true },
});

export { getHomeAction };
