import { getChildByCommentId, getChildByPrimaryId } from "server/database/get";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { insertChildComment } from "server/database/insert";
import { ServerError } from "server/utils/error";
import { transformPath } from "utils/path";
import { apiName } from "config/api";
import { deleteChildMessageByCommentId } from "server/database/delete";
import { updateTableWithParam } from "server/database/update";

// 获取子评论
export const getChildMessageByPrimaryIdAction = wrapperMiddlewareRequest({
  requestHandler: async function getChildMessageByPrimaryIdAction({ req, res }) {
    const { primaryCommentId } = req.query;
    const childMessage = await getChildByPrimaryId({ db: req.db!, primaryCommentId: primaryCommentId as string });
    childMessage.sort(({ createDate: d1 }, { createDate: d2 }) => (new Date(d1).getTime() > new Date(d2).getTime() ? 1 : -1));
    success({ res, resDate: { data: childMessage } });
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["primaryCommentId"] },
});

export const publishChildMessageByPrimaryIdAction = wrapperMiddlewareRequest({
  requestHandler: async function publishChildMessageByPrimaryIdAction({ req, res }) {
    const { primaryCommentId, blogId, commentId, userId, toIp, toUserId, content, preview, isMd, toPrimary } = req.body;
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
      isMd,
      preview,
      toPrimary,
    });
    success({ res, resDate: { state: "回复留言成功", data: `时间：${createDate}` } });
  },
  checkCodeConfig: { needCheck: true },
  cacheConfig: {
    needDelete: ({ req }) => transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: req.body.primaryCommentId }, needPre: false }),
  },
  paramsConfig: { fromBody: ["primaryCommentId", "blogId", "commentId", "toIp", "content"] },
});

export const deleteChildMessageByCommentIdAction = wrapperMiddlewareRequest({
  requestHandler: async function deleteChildMessageByCommentIdAction({ req, res }) {
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
  cacheConfig: {
    needDelete: ({ req }) => transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: req.body.primaryCommentId }, needPre: false }),
  },
  userConfig: { needCheck: true, checkStrict: true },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["commentId", "isChild", "userId", "primaryCommentId"] },
});

export const updateChildMessageByCommentIdAction = wrapperMiddlewareRequest({
  requestHandler: async function updateChildMessageByCommentIdAction({ req, res }) {
    const { isChild, newContent, commentId, preview, isMd } = req.body;
    if (!isChild) {
      throw new ServerError("请求路径错误", 404);
    }
    if (!newContent || !newContent.length) {
      throw new ServerError("content内容为空", 401);
    }
    // 进行更新
    if (isMd) {
      await updateTableWithParam({
        db: req.db!,
        table: "childComment",
        param: {
          set: {
            content: newContent,
            modifyState: 1,
            modifyDate: new Date().toLocaleString(),
            preview,
          },
          where: {
            commentId: { value: commentId },
          },
        },
      });
    } else {
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
    }
    success({ res, resDate: { state: "更新成功", data: `更新成功, ${commentId}` } });
  },
  checkCodeConfig: { needCheck: true },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: ({ req }) => transformPath({ apiPath: apiName.childMessage, query: { primaryCommentId: req.body.primaryCommentId }, needPre: false }),
  },
  paramsConfig: { fromBody: ["isChild", "newContent", "commentId", "primaryCommentId"] },
});
