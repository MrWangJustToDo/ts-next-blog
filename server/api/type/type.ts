import { ServerError } from "server/utils/error";
import { insertType } from "server/database/insert";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { getType, getTypeByTypeContent, getTypeCount } from "server/database/get";

// 获取type数据
const getTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const data = await getType({ db: req.db! });
    return success({ res, resDate: { data } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getTypeAction" } }),
  cacheConfig: { needCache: true },
});

// 判断当前type是否存在
const checkTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { typeContent } = req.body;
    if (!typeContent) {
      throw new ServerError("check type参数不正确", 400);
    }
    const result = await getTypeByTypeContent({ db: req.db!, typeContent });
    if (result) {
      throw new ServerError("type 内容重复", 400);
    }
    success({ res, resDate: { state: "建成通过", data: `当前type：${typeContent}可用` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "检测未通过", data: e.toString() } }),
  userConfig: { needCheck: true, checkStrict: true },
});

// 新增type
const addTypeAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { typeContent } = req.body;
    if (!typeContent) {
      throw new ServerError("add type参数不正确", 400);
    }
    const typeCount = await getTypeCount({ db: req.db! });
    await insertType({ db: req.db!, typeId: typeCount + 1, typeContent, typeCount: 0 });
    success({ res, resDate: { state: "新增type成功", data: `typeId: ${typeCount + 1}, typeContent: ${typeContent}` } });
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { state: "添加type失败", data: e.toString(), methodName: "addTypeAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
});

export { getTypeAction, checkTypeAction, addTypeAction };
