import { Database } from "sqlite";
import { TagProps } from "types/containers";
import { BlogContentProps, TypeProps, UserProps } from "types/hook";
import { ChildMessageProps, PrimaryMessageProps, UserExProps } from "types/components";

// 添加博客信息
const insertBlog = async ({
  db,
  authorId,
  blogId,
  blogState,
  blogOriginState,
  blogTitle,
  blogImgLink,
  blogCreateDate,
  blogModifyState,
  blogModifyDate,
  blogPreview,
  blogContent,
  blogAssentCount,
  blogCollectCount,
  blogReadCount,
  blogPriseState,
  blogCommentState,
  typeId,
  tagId,
}: BlogContentProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO blogs VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    authorId,
    blogId,
    blogState,
    blogOriginState,
    blogTitle,
    blogImgLink,
    blogCreateDate,
    blogModifyState,
    blogModifyDate,
    blogPreview,
    blogContent,
    blogAssentCount,
    blogCollectCount,
    blogReadCount,
    blogPriseState,
    blogCommentState,
    typeId,
    tagId
  );
};

// 添加首页信息
const insertHome = async ({
  db,
  authorId,
  blogId,
  blogState,
  blogTitle,
  blogCreateDate,
  blogCreateYear,
  blogImgLink,
  blogPreview,
  blogAssentCount,
  blogCollectCount,
  blogReadCount,
  typeId,
  tagId,
}: BlogContentProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO home VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
    authorId,
    blogId,
    blogState,
    blogTitle,
    blogCreateDate,
    blogCreateYear,
    blogImgLink,
    blogPreview,
    blogAssentCount,
    blogCollectCount,
    blogReadCount,
    typeId,
    tagId
  );
};

// 添加用户信息
const insertUser = async ({ db, ip, userId, userState, username, password, nickname, address, avatar, email, gender, qq }: UserProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    ip,
    userId,
    userState,
    username,
    password,
    nickname,
    address,
    avatar,
    email,
    gender,
    qq
  );
};

// 添加type信息
const insertType = async ({ db, typeId, typeState, typeContent, typeCount }: TypeProps & { db: Database }) => {
  return await db.run("INSERT INTO type VALUES(?,?,?,?)", typeId, typeState, typeContent, typeCount);
};

// 添加tag信息
const insertTag = async ({ db, tagId, tagState, tagContent, tagCount }: TagProps & { db: Database }) => {
  return await db.run("INSERT INTO tag VALUES(?,?,?,?)", tagId, tagState, tagContent, tagCount);
};

// 添加用户扩展信息
const insertUserEx = async ({ db, userId, collect, assent, publish, collectIds, assentIds }: UserExProps & { db: Database }) => {
  return await db.run("INSERT INTO usersEx VALUES(?,?,?,?,?,?)", userId, collect, assent, publish, collectIds, assentIds);
};

// 添加主回复
const insertPrimaryComment = async ({
  db,
  blogId,
  commentId,
  userId,
  ip,
  content,
  createDate,
  modifyState,
  modifyDate,
  childIds,
  childCount,
}: PrimaryMessageProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO primaryComment VALUES(?,?,?,?,?,?,?,?,?,?)",
    blogId,
    commentId,
    userId,
    ip,
    content,
    createDate,
    modifyState,
    modifyDate,
    childIds,
    childCount
  );
};

// 添加子回复
const insertChildComment = async ({
  db,
  blogId,
  primaryCommentId,
  commentId,
  fromIp,
  fromUserId,
  toIp,
  toUserId,
  content,
  createDate,
  modifyState,
  modifyDate,
}: ChildMessageProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO childComment VALUES(?,?,?,?,?,?,?,?,?,?,?)",
    blogId,
    primaryCommentId,
    commentId,
    fromIp,
    fromUserId,
    toIp,
    toUserId,
    content,
    createDate,
    modifyState,
    modifyDate
  );
};

export { insertBlog, insertHome, insertUserEx, insertUser, insertType, insertTag, insertChildComment, insertPrimaryComment };
