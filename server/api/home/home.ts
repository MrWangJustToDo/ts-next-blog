import { getBlogsByBlogTitle, getBlogsByTagId, getBlogsByTypeId, getHome } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { BlogContentProps } from "types/hook";

// 获取首页数据
const getHomeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const data = await getHome({ db: req.db! });
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getHomeAction" } }),
  cacheConfig: { needCache: true },
});

// 根据指定参数获取blog
const getBlogsByParams = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogTitle, typeId: currentTypeId, tagId: currentTagId } = req.body;
    let blogs: BlogContentProps[] = [];
    if (blogTitle) {
      blogs = await getBlogsByBlogTitle({ db: req.db!, blogTitle });
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
      blogs = await getBlogsByTypeId({ db: req.db!, typeId: currentTypeId });
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
      blogs = await getBlogsByTagId({ db: req.db!, tagId: currentTagId });
    }
    success({ res, resDate: { state: "搜索成功", data: blogs } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "搜索出错", data: e.toString(), methodName: "getBlogsByParams" } }),
  userConfig: { needCheck: true },
});

export { getHomeAction, getBlogsByParams };
