import { apiName } from "config/api";
import { getRandom } from "utils/data";
import { ServerError } from "server/utils/error";
import { insertTag } from "server/database/insert";
import { deleteTagByTagId } from "server/database/delete";
import { getTag, getTagByTagContent, getTagByTagId } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { TagProps } from "types/containers";

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
    const result = await getTagByTagContent({ db: req.db!, tagContent });
    if (result) {
      throw new ServerError("tag 内容重复", 400);
    }
    success({ res, resDate: { state: "检测通过", data: `当前tag：${tagContent}可以使用` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "检测未通过", data: e.toString() } }),
  userConfig: { needCheck: true },
  paramsConfig: { fromBody: ["tagContent"] },
});

// 新增tag
const addTagAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { tagContent } = req.body;
    const tagId = getRandom(10000).toString(16);
    await insertTag({ db: req.db!, tagId, tagState: 1, tagContent, tagCount: 0 });
    success({ res, resDate: { state: "新增tag成功", data: `tagId: ${tagId}, tagContent: ${tagContent}` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "添加tag失败", data: e.toString(), methodName: "addTagAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: [apiName.tag] },
  paramsConfig: { fromBody: ["tagContent"] },
});

// 删除tag
const deleteTagAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { deleteTag } = req.body;
    const tag = <TagProps>await getTagByTagId({ db: req.db!, tagId: deleteTag });
    if (!tag) {
      throw new ServerError(`需要删除的tag：${deleteTag}不存在`, 400);
    }
    if (tag.tagCount! > 0) {
      throw new ServerError(`删除的tag还有博客引用`, 400);
    }
    await deleteTagByTagId({ db: req.db!, tagId: deleteTag });
    success({ res, resDate: { state: "删除tag成功", data: `tagId: ${tag.tagId}, tagContent: ${tag.tagContent}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "删除tag失败", data: e.toString(), methodName: "deleteTagAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: [apiName.tag] },
  paramsConfig: { fromBody: ["deleteTag"] },
});

export { getTagAction, checkTagAction, addTagAction, deleteTagAction };
