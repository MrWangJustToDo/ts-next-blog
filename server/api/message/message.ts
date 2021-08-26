import { apiName } from "config/api";
import { log } from "utils/log";
import { transformPath } from "utils/path";
import { getPrimaryByBlogId, getChildByPrimaryId, getPrimaryByCommentId, getChildByCommentId } from "server/database/get";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { insertChildComment, insertPrimaryComment } from "server/database/insert";
import { ServerError } from "server/utils/error";
import {
  deletePrimaryMessageByBlogId,
  deleteChildMessageByPrimaryId,
  deletePrimaryMessageByCommentId,
  deleteChildMessageByCommentId,
} from "server/database/delete";
import { PrimaryMessageProps } from "types/components";
import { updateTableWithParam } from "server/database/updata";

// 获取主评论
const getPrimaryMessageByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogId } = req.query;
    const primaryMessages = await getPrimaryByBlogId({ db: req.db!, blogId: blogId as string });
    primaryMessages.sort(({ createDate: d1 }, { createDate: d2 }) => (new Date(d1).getTime() > new Date(d2).getTime() ? -1 : 1));
    return success({ res, resDate: { state: "获取成功", data: primaryMessages } });
  },
  errorHandler: ({ res, e, code = 404 }) =>
    fail({ res, statuCode: code, resDate: { state: "获取失败", data: e.toString(), methodName: "getPrimaryMessageByBlogIdAction" } }),
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["blogId"] },
});

// 获取子评论
const getChildMessageByPrimaryIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { primaryCommentId } = req.query;
    const childMessage = await getChildByPrimaryId({ db: req.db!, primaryCommentId: primaryCommentId as string });
    childMessage.sort(({ createDate: d1 }, { createDate: d2 }) => (new Date(d1).getTime() > new Date(d2).getTime() ? -1 : 1));
    return success({ res, resDate: { data: childMessage } });
  },
  errorHandler: ({ res, e, code = 404 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getChildMessageByPrimaryIdAction" } }),
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["primaryCommentId"] },
});

// 根据博客id删除所有评论
const deleteAllMessageByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res, cache }) => {
    const { blogId } = req.body;
    const primaryIds: string[] = [];
    const errorStack: string[] = [];
    // 获取需要删除的主评论
    const primaryMessages: PrimaryMessageProps[] = await getPrimaryByBlogId({ db: req.db!, blogId });
    primaryMessages.forEach(({ commentId }) => primaryIds.push(String(commentId)));
    // 删除主评论缓存
    primaryIds.forEach((commentId) =>
      cache.deleteRightNow(transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: commentId }, needPre: false }))
    );
    // 删除主评论
    await deletePrimaryMessageByBlogId({ db: req.db!, blogId });
    // 删除子评论
    for (let id of primaryIds) {
      try {
        await deleteChildMessageByPrimaryId({ db: req.db!, primaryId: id });
      } catch (e) {
        log(`deleteAllMessageByBlogIdAction 出错, 当前删除primaryId: ${id}, error: ${e.toString()}`, "error");
        errorStack.push(id);
      }
    }
    success({ res, resDate: { state: "删除成功", data: `删除blogId: ${blogId} 下的所有message` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "删除失败", data: e.toString(), methodName: "deleteAllMessageByBlogId" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  paramsConfig: { fromBody: ["blogId"] },
});

// 发布主评论
const publishPrimaryMessageByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogId, commentId, userId, content, isMd, preview } = req.body;
    if (!content || !content.length) {
      throw new ServerError("content内容为空", 401);
    }
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
      isMd,
      preview,
    });
    success({ res, resDate: { state: "评论留言成功", data: `时间：${createDate}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "评论发布错误", data: e.toString(), methodName: "publishPrimaryMessageByBlogIdAction" } }),
  checkCodeConfig: { needCheck: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  paramsConfig: { fromBody: ["blogId", "commentId", "content"] },
});

// 发布子评论
const publishChildMessageByPrimaryIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { primaryCommentId, blogId, commentId, userId, toIp, toUserId, content } = req.body;
    if (!content || !content.length) {
      throw new ServerError("content内容为空", 401);
    }
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
  paramsConfig: { fromBody: ["primaryCommentId", "blogId", "commentId", "toIp", "content"] },
});

// 删除主评论
const deletePrimaryMessageByCommentIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { commentId, isChild, userId } = req.body;
    if (isChild) {
      throw new ServerError("请求路径不正确", 404);
    }
    // 获取要删除的评论
    const primaryMessage = await getPrimaryByCommentId({ db: req.db!, commentId });
    if (!primaryMessage) {
      throw new ServerError("评论不存在", 401);
    } else if (primaryMessage.fromUserId && primaryMessage.fromUserId !== userId) {
      throw new ServerError("没有删除权限", 403);
    }
    await deletePrimaryMessageByCommentId({ db: req.db!, commentId });
    await deleteChildMessageByPrimaryId({ db: req.db!, primaryId: commentId });
    success({ res, resDate: { state: "删除成功", data: `删除成功, commentId: ${commentId}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "删除评论出错", data: e.toString(), methodName: "deletePrimaryMessageByCommentId" } }),
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  userConfig: { needCheck: true, checkStrict: true },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["commentId", "isChild", "userId", "blogId"] },
});

// 删除子评论
const deleteChildMessageByCommentIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { commentId, isChild, userId } = req.body;
    if (!isChild) {
      throw new ServerError("请求路径不正确", 404);
    }
    const childMessage = await getChildByCommentId({ db: req.db!, commentId });
    if (!childMessage) {
      throw new ServerError("评论不存在", 401);
    } else if (childMessage.fromUserId && childMessage.fromUserId !== userId) {
      throw new ServerError("没有删除权限", 403);
    }
    await deleteChildMessageByCommentId({ db: req.db!, commentId });
    success({ res, resDate: { state: "删除成功", data: `删除成功, commentId: ${commentId}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "删除评论出错", data: e.toString(), methodName: "deleteChildMessageByCommentIdAction" } }),
  cacheConfig: {
    needDelete: ({ req }) => transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: req.body.primaryCommentId }, needPre: false }),
  },
  userConfig: { needCheck: true, checkStrict: true },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["commentId", "isChild", "userId", "primaryCommentId"] },
});

// 修改主评论
const updatePrimaryMessageByCommentIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { isChild, newContent, commentId } = req.body;
    if (isChild) {
      throw new ServerError("请求路径错误", 404);
    }
    if (!newContent || !newContent.length) {
      throw new ServerError("content内容为空", 401);
    }
    // 进行更新
    await updateTableWithParam({
      db: req.db!,
      table: "primaryComment",
      param: {
        set: {
          content: newContent,
          modifyState: 1,
          modifyDate: new Date().toLocaleString(),
        },
        where: {
          commentId: { value: commentId },
        },
      },
    });
    success({ res, resDate: { state: "更新成功", data: `更新成功, ${commentId}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "更新失败", data: e.toString(), methodName: "updatePrimaryMessageByCommentIdAction" } }),
  checkCodeConfig: { needCheck: true },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  paramsConfig: { fromBody: ["isChild", "newContent", "commentId", "blogId"] },
});

// 修改子评论
const updateChildMessageByCommentIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { isChild, newContent, commentId } = req.body;
    if (!isChild) {
      throw new ServerError("请求路径错误", 404);
    }
    if (!newContent || !newContent.length) {
      throw new ServerError("content内容为空", 401);
    }
    // 进行更新
    await updateTableWithParam({
      db: req.db!,
      table: "childComment",
      param: {
        set: {
          content: newContent,
          modifyState: 1,
          modifyDate: new Date().toLocaleString(),
        },
        where: {
          commentId: { value: commentId },
        },
      },
    });
    success({ res, resDate: { state: "更新成功", data: `更新成功, ${commentId}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "更新失败", data: e.toString(), methodName: "updateChildMessageByCommentIdAction" } }),
  checkCodeConfig: { needCheck: true },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: ({ req }) => transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: req.body.primaryCommentId }, needPre: false }),
  },
  paramsConfig: { fromBody: ["isChild", "newContent", "commentId", "primaryCommentId"] },
});

export {
  deleteAllMessageByBlogIdAction,
  getPrimaryMessageByBlogIdAction,
  getChildMessageByPrimaryIdAction,
  publishPrimaryMessageByBlogIdAction,
  publishChildMessageByPrimaryIdAction,
  deleteChildMessageByCommentIdAction,
  deletePrimaryMessageByCommentIdAction,
  updatePrimaryMessageByCommentIdAction,
  updateChildMessageByCommentIdAction,
};
