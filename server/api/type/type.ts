import { apiName } from "config/api";
import { getRandom } from "utils/data";
import { ServerError } from "server/utils/error";
import { insertType } from "server/database/insert";
import { deleteTypeByTypeId } from "server/database/delete";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { getType, getTypeByTypeContent, getTypeByTypeId } from "server/database/get";
import { transformPath } from "utils/path";

// 获取type数据
export const getTypeAction = wrapperMiddlewareRequest({
  requestHandler: async function getTypeAction({ req, res }) {
    const data = await getType({ db: req.db! });
    success({ res, resDate: { data } });
  },
  cacheConfig: { needCache: true, cacheKey: transformPath({ apiPath: apiName.type, needPre: false }) },
});

// 判断当前type是否存在
export const checkTypeAction = wrapperMiddlewareRequest({
  requestHandler: async function checkTypeAction({ req, res }) {
    const { typeContent } = req.body;
    const result = await getTypeByTypeContent({ db: req.db!, typeContent });
    if (result) {
      throw new ServerError("type 内容重复", 400);
    }
    success({ res, resDate: { state: "建成通过", data: `当前type：${typeContent}可用` } });
  },
  userConfig: { needCheck: true },
  cacheConfig: { needCache: true },
  paramsConfig: { fromBody: ["typeContent"], fromQuery: ["typeContent"] },
});

// 新增type
export const addTypeAction = wrapperMiddlewareRequest({
  requestHandler: async function addTypeAction({ req, res }) {
    const { typeContent } = req.body;
    const typeId = getRandom(10000).toString(16);
    await insertType({ db: req.db!, typeId, typeState: 1, typeContent, typeCount: 0 });
    success({ res, resDate: { state: "新增type成功", data: `typeId: ${typeId}, typeContent: ${typeContent}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [apiName.type, ({ req }) => transformPath({ apiPath: apiName.checkType, query: { typeContent: req.body.typeContent }, needPre: false })],
  },
  paramsConfig: { fromBody: ["typeContent"] },
});

// 删除type
export const deleteTypeAction = wrapperMiddlewareRequest({
  requestHandler: async function deleteTypeAction({ req, res }) {
    const { deleteType } = req.body;
    const type = await getTypeByTypeId({ db: req.db!, typeId: deleteType });
    if (!type) {
      throw new ServerError(`需要删除的type：${deleteType}不存在`, 400);
    }
    if (type.typeCount! > 0) {
      throw new ServerError(`需要删除的type的博客引用不为0`, 400);
    }
    await deleteTypeByTypeId({ db: req.db!, typeId: deleteType });
    success({ res, resDate: { state: "删除type成功", data: `typeId: ${type.typeId}, typeContent: ${type.typeContent}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [apiName.type, ({ req }) => transformPath({ apiPath: apiName.checkType, query: { typeContent: req.body.typeContent }, needPre: false })],
  },
  paramsConfig: { fromBody: ["deleteType", "typeContent"] },
});
