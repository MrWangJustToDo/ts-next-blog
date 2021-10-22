import { getBlogsByBlogTitleAndUserId, getBlogsByTagIdAndUserId, getBlogsByTypeIdAndUserId, getHome, getHomeByUserId } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { BlogContentProps } from "types/hook";

// 获取首页数据
const getHomeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const data = (await getHome({ db: req.db! })) as BlogContentProps[];
    data.sort(({ blogCreateDate: d1 }, { blogCreateDate: d2 }) => (new Date(d1!).getTime() > new Date(d2!).getTime() ? -1 : 1));
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { data: e.toString(), methodName: "getHomeAction" } }),
  cacheConfig: { needCache: true },
});

// 根据指定参数获取blog
const getBlogsByParams = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogTitle, typeId: currentTypeId, tagId: currentTagId, userId } = req.body;
    let blogs: BlogContentProps[] = [];
    if (blogTitle) {
      blogs = await getBlogsByBlogTitleAndUserId({ db: req.db!, blogTitle, userId });
      blogs = blogs.filter(({ typeId, tagId }) => {
        if (currentTypeId) {
          if (typeId !== currentTypeId) {
            return false;
          }
        }
        if (currentTagId) {
          const currentTagArray = currentTagId.split(",");
          if ((currentTagArray as string[]).some((it) => !tagId?.includes(it))) {
            return false;
          }
        }
        return true;
      });
    } else if (currentTypeId) {
      blogs = await getBlogsByTypeIdAndUserId({ db: req.db!, typeId: currentTypeId, userId });
      blogs = blogs.filter(({ tagId }) => {
        if (currentTagId) {
          const currentTagArray = currentTagId.split(",");
          if ((currentTagArray as string[]).some((it) => !tagId?.includes(it))) {
            return false;
          }
        }
        return true;
      });
    } else if (currentTagId) {
      blogs = await getBlogsByTagIdAndUserId({ db: req.db!, tagId: currentTagId, userId });
    }
    success({ res, resDate: { state: "搜索成功", data: blogs } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { state: "搜索出错", data: e.toString(), methodName: "getBlogsByParams" } }),
  userConfig: { needCheck: true },
  cacheConfig: {
    needCache: true,
    cacheKey: ({ req }) => {
      const { blogTitle = "", typeId = "", tagId = "" } = req.body;
      return req.url + `?${blogTitle}:${typeId}:${tagId}`;
    },
  },
  paramsConfig: { fromBody: ["userId"] },
});

const getUserHomeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { userId } = req.query;
    const data = (await getHomeByUserId({ db: req.db!, userId: userId as string })) as BlogContentProps[];
    data.sort(({ blogCreateDate: d1 }, { blogCreateDate: d2 }) => (new Date(d1!).getTime() > new Date(d2!).getTime() ? -1 : 1));
    success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statusCode: code, resDate: { state: "获取失败", data: e.toString(), methodName: "getUserHomeAction" } }),
  userConfig: { needCheck: true },
  paramsConfig: { fromQuery: ["userId"] },
});

export { getHomeAction, getBlogsByParams, getUserHomeAction };
