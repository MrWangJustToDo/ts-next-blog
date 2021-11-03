import { apiName } from "config/api";
import { getRandom } from "utils/data";
import { ServerError } from "server/utils/error";
import { insertType } from "server/database/insert";
import { deleteTypeByTypeId } from "server/database/delete";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { getType, getTypeByTypeContent, getTypeByTypeId } from "server/database/get";
import { TypeProps } from "types/hook";

// 获取type数据
const getTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const data = await getType({ db: req.db! });
    success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { data: e.toString(), methodName: "getTypeAction" } }),
  cacheConfig: { needCache: true },
});

// 判断当前type是否存在
const checkTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { typeContent } = req.body;
    const result = await getTypeByTypeContent({ db: req.db!, typeContent });
    if (result) {
      throw new ServerError("type 内容重复", 400);
    }
    success({ res, resDate: { state: "建成通过", data: `当前type：${typeContent}可用` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statusCode: code, resDate: { state: "检测未通过", data: e.toString() } }),
  userConfig: { needCheck: true },
  cacheConfig: { needCache: true },
  paramsConfig: { fromBody: ["typeContent"] },
});

// 新增type
const addTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { typeContent } = req.body;
    const typeId = getRandom(10000).toString(16);
    await insertType({ db: req.db!, typeId, typeState: 1, typeContent, typeCount: 0 });
    success({ res, resDate: { state: "新增type成功", data: `typeId: ${typeId}, typeContent: ${typeContent}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statusCode: code, resDate: { state: "添加type失败", data: e.toString(), methodName: "addTypeAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: [apiName.type] },
  paramsConfig: { fromBody: ["typeContent"] },
});

// 删除type
const deleteTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { deleteType } = req.body;
    const type = <TypeProps>await getTypeByTypeId({ db: req.db!, typeId: deleteType });
    if (!type) {
      throw new ServerError(`需要删除的type：${deleteType}不存在`, 400);
    }
    if (type.typeCount! > 0) {
      throw new ServerError(`需要删除的type的博客引用不为0`, 400);
    }
    await deleteTypeByTypeId({ db: req.db!, typeId: deleteType });
    success({ res, resDate: { state: "删除type成功", data: `typeId: ${type.typeId}, typeContent: ${type.typeContent}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statusCode: code, resDate: { state: "删除type出错", data: e.toString(), methodName: "deleteTypeAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: [apiName.type] },
  paramsConfig: { fromBody: ["deleteType"] },
});

export { getTypeAction, checkTypeAction, addTypeAction, deleteTypeAction };
