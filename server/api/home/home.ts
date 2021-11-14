import { apiName } from "config/api";
import { getBlogsByBlogTitleAndUserId, getBlogsByTagIdAndUserId, getBlogsByTypeIdAndUserId, getHome, getHomeByUserId } from "server/database/get";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { HomeBlogProps, UserProps } from "types";
import { transformPath } from "utils/path";

// 获取首页数据
const homeCacheKey = transformPath({ apiPath: apiName.home, needPre: false });
export const getHomeAction = wrapperMiddlewareRequest({
  requestHandler: async function getHomeAction({ req, res }) {
    const data = await getHome({ db: req.db! });
    data.sort(({ blogCreateDate: d1 }, { blogCreateDate: d2 }) => (new Date(d1!).getTime() > new Date(d2!).getTime() ? -1 : 1));
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true, cacheKey: homeCacheKey },
});

// 根据指定参数获取blog
export const getBlogsByParams = wrapperMiddlewareRequest({
  requestHandler: async function getBlogsByParams({ req, res }) {
    const { blogTitle, typeId: currentTypeId, tagId: currentTagId, userId } = req.body;
    let blogs: Array<HomeBlogProps & UserProps> = [];
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
  userConfig: { needCheck: true },
  cacheConfig: {
    needCache: true,
    cacheKey: ({ req }) => {
      const { blogTitle = "", typeId = "", tagId = "", userId } = req.body;
      return transformPath({ apiPath: apiName.search, needPre: false, query: { userId, blogTitle, typeId, tagId } });
    },
  },
  paramsConfig: { fromBody: ["userId"] },
});

export const getUserHomeAction = wrapperMiddlewareRequest({
  requestHandler: async function getUserHomeAction({ req, res }) {
    const { userId } = req.query;
    const data = await getHomeByUserId({ db: req.db!, userId: userId as string });
    data.sort(({ blogCreateDate: d1 }, { blogCreateDate: d2 }) => (new Date(d1!).getTime() > new Date(d2!).getTime() ? -1 : 1));
    success({ res, resDate: { data } });
  },
  userConfig: { needCheck: true },
  paramsConfig: { fromQuery: ["userId"] },
});
