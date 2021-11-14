import { apiName } from "config/api";
import { getPrimaryByBlogId, getPrimaryByCommentId } from "server/database/get";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { insertPrimaryComment } from "server/database/insert";
import { deleteChildMessageByPrimaryId, deletePrimaryMessageByBlogId, deletePrimaryMessageByCommentId } from "server/database/delete";
import { log } from "utils/log";
import { transformPath } from "utils/path";
import { ServerError } from "server/utils/error";
import { updateTableWithParam } from "server/database/update";

export const getPrimaryMessageByBlogIdAction = wrapperMiddlewareRequest({
  requestHandler: async function getPrimaryMessageByBlogIdAction({ req, res }) {
    const { blogId } = req.query;
    const primaryMessages = await getPrimaryByBlogId({ db: req.db!, blogId: blogId as string });
    primaryMessages.sort(({ createDate: d1 }, { createDate: d2 }) => (new Date(d1).getTime() > new Date(d2).getTime() ? -1 : 1));
    success({ res, resDate: { state: "获取成功", data: primaryMessages } });
  },
  cacheConfig: { needCache: true },
  paramsConfig: { fromQuery: ["blogId"] },
});

export const deleteAllMessageByBlogIdAction = wrapperMiddlewareRequest({
  requestHandler: async function deleteAllMessageByBlogIdAction({ req, res, cache }) {
    const { blogId } = req.body;
    const primaryIds: string[] = [];
    const errorStack: string[] = [];
    // 获取需要删除的主评论
    const primaryMessages = await getPrimaryByBlogId({ db: req.db!, blogId });
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
        log(`deleteAllMessageByBlogIdAction 出错, 当前删除primaryId: ${id}, error: ${(e as Error).toString()}`, "error");
        errorStack.push(id);
      }
    }
    success({ res, resDate: { state: "删除成功", data: `删除blogId: ${blogId} 下的所有message` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  paramsConfig: { fromBody: ["blogId"] },
});

export const publishPrimaryMessageByBlogIdAction = wrapperMiddlewareRequest({
  requestHandler: async function publishPrimaryMessageByBlogIdAction({ req, res }) {
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
  checkCodeConfig: { needCheck: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  paramsConfig: { fromBody: ["blogId", "commentId", "content"] },
});

export const deletePrimaryMessageByCommentIdAction = wrapperMiddlewareRequest({
  requestHandler: async function deletePrimaryMessageByCommentIdAction({ req, res }) {
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
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  userConfig: { needCheck: true, checkStrict: true },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["commentId", "isChild", "userId", "blogId"] },
});

export const updatePrimaryMessageByCommentIdAction = wrapperMiddlewareRequest({
  requestHandler: async function updatePrimaryMessageByCommentIdAction({ req, res }) {
    const { isChild, newContent, commentId, preview, isMd } = req.body;
    if (isChild) {
      throw new ServerError("请求路径错误", 404);
    }
    if (!newContent || !newContent.length) {
      throw new ServerError("content内容为空", 401);
    }
    // 进行更新
    if (isMd) {
      await updateTableWithParam({
        db: req.db!,
        table: "primaryComment",
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
    }
    success({ res, resDate: { state: "更新成功", data: `更新成功, ${commentId}` } });
  },
  checkCodeConfig: { needCheck: true },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: ({ req }) => transformPath({ apiPath: apiName.primaryMessage, query: { blogId: req.body.blogId }, needPre: false }) },
  paramsConfig: { fromBody: ["isChild", "newContent", "commentId", "blogId"] },
});
