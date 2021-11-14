import { Database } from "sqlite";
import { AuthorProps, BlogProps, ChildCommentProps, HomeBlogProps, PrimaryCommentProps, ServerTagProps, TypeProps, UserProps, UsersExProps } from "types";

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
}: BlogProps & { db: Database }) => {
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
}: HomeBlogProps & { db: Database }) => {
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
const insertTag = async ({ db, tagId, tagState, tagContent, tagCount }: ServerTagProps & { db: Database }) => {
  return await db.run("INSERT INTO tag VALUES(?,?,?,?)", tagId, tagState, tagContent, tagCount);
};

// 添加用户扩展信息
const insertUserEx = async ({ db, userId, collect, assent, publish, collectIds, assentIds }: UsersExProps & { db: Database }) => {
  return await db.run("INSERT INTO usersEx VALUES(?,?,?,?,?,?)", userId, collect, assent, publish, collectIds, assentIds);
};

// 添加主回复
const insertPrimaryComment = async ({
  db,
  blogId,
  commentId,
  fromUserId,
  fromIp,
  content,
  createDate,
  modifyState,
  modifyDate,
  childIds,
  childCount,
  preview,
  isMd,
}: PrimaryCommentProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO primaryComment VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
    blogId,
    commentId,
    fromUserId,
    fromIp,
    content,
    createDate,
    modifyState,
    modifyDate,
    childIds,
    childCount,
    isMd,
    preview
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
  isMd,
  preview,
}: ChildCommentProps & { db: Database }) => {
  return await db.run(
    "INSERT INTO childComment VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
    isMd,
    preview
  );
};

const insertAuthor = async ({ db, userId, userAlipay, userWechat, cacheState }: AuthorProps & { db: Database }) => {
  return await db.run("INSERT INTO author VALUES(?,?,?,?)", userId, userAlipay, userWechat, cacheState);
};

export { insertBlog, insertHome, insertUserEx, insertUser, insertType, insertTag, insertChildComment, insertPrimaryComment, insertAuthor };
