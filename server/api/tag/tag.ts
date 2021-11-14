import { apiName } from "config/api";
import { getRandom } from "utils/data";
import { ServerError } from "server/utils/error";
import { insertTag } from "server/database/insert";
import { deleteTagByTagId } from "server/database/delete";
import { getTag, getTagByTagContent, getTagByTagId } from "server/database/get";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { transformPath } from "utils/path";

// 获取tag数据
const tagKey = transformPath({ apiPath: apiName.tag, needPre: false });
export const getTagAction = wrapperMiddlewareRequest({
  requestHandler: async function getTagAction({ req, res }) {
    const data = await getTag({ db: req.db! });
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true, cacheKey: tagKey },
});

// 判断当前tag是否存在
export const checkTagAction = wrapperMiddlewareRequest({
  requestHandler: async function checkTagAction({ req, res }) {
    const { tagContent } = req.body;
    const result = await getTagByTagContent({ db: req.db!, tagContent });
    if (result) {
      throw new ServerError("tag 内容重复", 400);
    }
    success({ res, resDate: { state: "检测通过", data: `当前tag：${tagContent}可以使用` } });
  },
  userConfig: { needCheck: true },
  cacheConfig: { needCache: true },
  paramsConfig: { fromBody: ["tagContent"], fromQuery: ["tagContent"] },
});

// 新增tag
export const addTagAction = wrapperMiddlewareRequest({
  requestHandler: async function addTagAction({ req, res }) {
    const { tagContent } = req.body;
    const tagId = getRandom(10000).toString(16);
    await insertTag({ db: req.db!, tagId, tagState: 1, tagContent, tagCount: 0 });
    success({ res, resDate: { state: "新增tag成功", data: `tagId: ${tagId}, tagContent: ${tagContent}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [
      apiName.tag,
      ({ req }) =>
        transformPath({
          apiPath: apiName.checkTag,
          needPre: false,
          query: {
            tagContent: req.body.tagContent,
          },
        }),
    ],
  },
  paramsConfig: { fromBody: ["tagContent"] },
});

// 删除tag
export const deleteTagAction = wrapperMiddlewareRequest({
  requestHandler: async function deleteTagAction({ req, res }) {
    const { deleteTag } = req.body;
    const tag = await getTagByTagId({ db: req.db!, tagId: deleteTag });
    if (!tag) {
      throw new ServerError(`需要删除的tag：${deleteTag}不存在`, 400);
    }
    if (tag.tagCount! > 0) {
      throw new ServerError(`删除的tag还有博客引用`, 400);
    }
    await deleteTagByTagId({ db: req.db!, tagId: deleteTag });
    success({ res, resDate: { state: "删除tag成功", data: `tagId: ${tag.tagId}, tagContent: ${tag.tagContent}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [
      apiName.tag,
      ({ req }) =>
        transformPath({
          apiPath: apiName.checkTag,
          needPre: false,
          query: {
            tagContent: req.body.tagContent,
          },
        }),
    ],
  },
  paramsConfig: { fromBody: ["deleteTag", "tagContent"] },
});
