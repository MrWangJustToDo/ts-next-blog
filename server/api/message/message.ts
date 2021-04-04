import { apiName } from "config/api";
import { transformPath } from "utils/path";
import { ServerError } from "server/utils/error";
import { getPrimaryByBlogId, getChildByPrimaryId } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { insertChildComment, insertPrimaryComment } from "server/database/insert";
import { deletePrimaryMessageByBlogId, deleteChildMessageByPrimaryId } from "server/database/delete";
import { PrimaryMessageProps } from "types/components";

// 获取主评论
const getPrimaryMessageByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const body = req.body || {};
    const { blogId } = body;
    if (blogId === undefined) {
      throw new ServerError("博客id参数不存在", 400);
    }
    const primaryMessages = await getPrimaryByBlogId({ db: req.db!, blogId });
    return success({ res, resDate: { state: "获取成功", data: primaryMessages } });
  },
  errorHandler: ({ res, e, code = 404 }) =>
    fail({ res, statuCode: code, resDate: { state: "获取失败", data: e.toString(), methodName: "getPrimaryMessageByBlogIdAction" } }),
  cacheConfig: { needCache: true },
});

// 获取子评论
const getChildMessageByPrimaryIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const body = req.body || {};
    const { primaryCommentId } = body;
    if (primaryCommentId === undefined) {
      throw new ServerError("主评论id参数不存在", 400);
    }
    const childMessage = await getChildByPrimaryId({ db: req.db!, primaryCommentId });
    return success({ res, resDate: { data: childMessage } });
  },
  errorHandler: ({ res, e, code = 404 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getChildMessageByPrimaryIdAction" } }),
  cacheConfig: { needCache: true },
});

// 根据博客id删除所有评论
const deleteAllMessageByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogId } = req.body;
    if (!blogId) {
      throw new ServerError("请求的blogId参数不存在", 400);
    }
    const primaryIds: string[] = [];
    // 获取需要删除的主评论
    const primaryMessages: PrimaryMessageProps[] = await getPrimaryByBlogId({ db: req.db!, blogId });
    primaryMessages.forEach(({ commentId }) => primaryIds.push(String(commentId)));
    // 删除主评论
    await deletePrimaryMessageByBlogId({ db: req.db!, blogId });
    // 删除子评论
    for (let id of primaryIds) {
      await deleteChildMessageByPrimaryId({ db: req.db!, primaryId: id });
    }
    success({ res, resDate: { state: "删除成功", data: `删除blogId: ${blogId} 下的所有message` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "删除失败", data: e.toString(), methodName: "deleteAllMessageByBlogId" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
});

// 发布主评论
const publishPrimaryMessageByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogId, commentId, userId, content } = req.body;
    const now = new Date();
    const fromIp = req.ip;
    const createDate = now.toLocaleString();
    const modifyState = 0;
    const modifyDate = now.toLocaleString();
    const childIds = "";
    const childCount = 0;
    await insertPrimaryComment({
      db: req.db!,
      blogId,
      commentId,
      fromUserId: userId,
      fromIp,
      content,
      createDate,
      modifyDate,
      modifyState,
      childIds,
      childCount,
    });
    success({ res, resDate: { state: "评论留言成功", data: `时间：${createDate}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "评论发布错误", data: e.toString(), methodName: "publishPrimaryMessageByBlogIdAction" } }),
  checkCodeConfig: { needCheck: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
});

// 发布子评论
const publishChildMessageByPrimaryIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { primaryCommentId, blogId, commentId, userId, toIp, toUserId, content } = req.body;
    const now = new Date();
    const fromIp = req.ip;
    const createDate = now.toLocaleString();
    const modifyState = 0;
    const modifyDate = now.toLocaleString();
    await insertChildComment({
      db: req.db!,
      blogId,
      primaryCommentId,
      commentId,
      fromIp,
      fromUserId: userId,
      toIp,
      toUserId,
      content,
      createDate,
      modifyState,
      modifyDate,
    });
    success({ res, resDate: { state: "回复留言成功", data: `时间：${createDate}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "发布回复出错", data: e.toString(), methodName: "publishChildMessageByPrimaryIdAction" } }),
  checkCodeConfig: { needCheck: true },
  cacheConfig: {
    needDelete: ({ req }) => transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: req.body.primaryCommentId }, needPre: false }),
  },
});

export {
  getChildMessageByPrimaryIdAction,
  getPrimaryMessageByBlogIdAction,
  deleteAllMessageByBlogIdAction,
  publishPrimaryMessageByBlogIdAction,
  publishChildMessageByPrimaryIdAction,
};
