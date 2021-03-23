import { ServerError } from "server/utils/error";
import { insertTag } from "server/database/insert";
import { getTag, getTagByTagContent, getTagCount } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";

// 获取tag数据
const getTagAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const data = await getTag({ db: req.db! });
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getTagAction" } }),
  cacheConfig: { needCache: true },
});

// 判断当前tag是否存在
const checkTagAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { tagContent } = req.body;
    if (!tagContent) {
      throw new ServerError("check tag参数不正确", 400);
    }
    const result = await getTagByTagContent({ db: req.db!, tagContent });
    if (result) {
      throw new ServerError("tag 内容重复", 400);
    }
    success({ res, resDate: { state: "检测通过", data: `当前tag：${tagContent}可以使用` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "检测未通过", data: e.toString() } }),
  userConfig: { needCheck: true, checkStrict: true },
});

// 新增tag
const addTagAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { tagContent } = req.body;
    if (!tagContent) {
      throw new ServerError("add tag参数不正确", 400);
    }
    const tagCount = await getTagCount({ db: req.db! });
    await insertTag({ db: req.db!, tagId: tagCount + 1, tagContent, tagCount: 0 });
    success({ res, resDate: { state: "新增tag成功", data: `tagId: ${tagCount + 1}, tagContent: ${tagContent}` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "添加tag失败", data: e.toString(), methodName: "addTagAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
});

export { getTagAction, checkTagAction, addTagAction };
