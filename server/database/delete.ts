import { Database } from "sqlite";

// 删除指定blog
const deleteBlogByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.run("DELETE FROM blogs WHERE blogId = ?", blogId);
};

// 设置指定blog为删除状态
const deleteBlogByBlogIdWithBlogState = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.run("UPDATE blogs SET blogState = ? WHERE blogId = ?", -1, blogId);
};

// 删除指定home
const deleteHomeByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.run("DELETE FROM home WHERE blogId = ?", blogId);
};

// 设置指定home为删除状态
const deleteHomeByBlogIdWithBlogState = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.run("UPDATE blogs SET blogState = ? WHERE blogId = ?", -1, blogId);
};

// 删除指定type
const deleteTypeByTypeId = async ({ db, typeId }: { db: Database; typeId: string }) => {
  return await db.run("DELETE FROM type WHERE typeId = ?", typeId);
};

// 设置指定type为删除状态
const deleteTypeByTypeIdWithTypeState = async ({ db, typeId }: { db: Database; typeId: string }) => {
  return await db.run("UPDATE type SET typeId = ? WHERE typeId = ?", -1, typeId);
};

// 删除指定tag
const deleteTagByTagId = async ({ db, tagId }: { db: Database; tagId: string }) => {
  return await db.run("DELETE FROM tag WHERE tagId = ?", tagId);
};

// 删除指定博客下的所有primaryMessage
const deletePrimaryMessageByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.run("DELETE FROM primaryComment WHERE blogId = ?", blogId);
};

// 删除指定primaryMessage
const deletePrimaryMessageByCommentId = async ({ db, commentId }: { db: Database; commentId: string }) => {
  return await db.run("DELETE FROM primaryComment WHERE commentId = ?", commentId);
};

// 删除指定primaryMessage下的所有childMessage
const deleteChildMessageByPrimaryId = async ({ db, primaryId }: { db: Database; primaryId: string }) => {
  return await db.run("DELETE FROM childComment WHERE primaryCommentId = ?", primaryId);
};

// 删除指定childMessage
const deleteChildMessageByCommentId = async ({ db, commentId }: { db: Database; commentId: string }) => {
  return await db.run("DELETE FROM childComment WHERE commentId = ?", commentId);
};

export { deleteBlogByBlogId, deleteBlogByBlogIdWithBlogState, deleteHomeByBlogId, deleteHomeByBlogIdWithBlogState };

export { deleteTypeByTypeId, deleteTypeByTypeIdWithTypeState, deleteTagByTagId, deletePrimaryMessageByBlogId };

export { deletePrimaryMessageByCommentId, deleteChildMessageByPrimaryId, deleteChildMessageByCommentId };
