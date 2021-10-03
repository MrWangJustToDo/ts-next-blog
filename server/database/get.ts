import { Database } from "sqlite";
import { mergeTypeTagToBlog } from "server/utils/merge";
import { BlogContentProps } from "types/hook";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";

// 根据用户名与密码获取用户信息
const getUserByUser = async ({ username, password, db }: { username: string; password: string; db: Database }) => {
  return await db.get("SELECT rowid as id, * FROM users WHERE username = ? AND password = ?", username, password);
};

// 根据用户id获取用户信息
const getUserByUserId = async ({ userId, db }: { userId: string; db: Database }) => {
  return await db.get("SELECT * FROM users WHERE users.userId = ?", userId);
};

// 根据用户名获取用户信息
const getUserByUserName = async ({ userName, db }: { userName: string; db: Database }) => {
  return await db.get("SELECT * FROM users WHERE users.username = ?", userName);
};

// 获取总的用户数
const getUserCount = async ({ db }: { db: Database }) => {
  return await db.get("SELECT COUNT(*) FROM users");
};

// 获取home数据
const getHome = async ({ db }: { db: Database }) => {
  const aliveHome = await db.all("SELECT * FROM home LEFT JOIN users WHERE home.authorId = users.userId AND home.blogState != -1");
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return aliveHome.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

const getHomeByUserId = async ({ db, userId }: { db: Database; userId: string }) => {
  const aliveHome = await db.all(
    "SELECT * FROM home LEFT JOIN users WHERE home.authorId = ? And home.authorId = users.userId AND home.blogState != -1",
    userId
  );
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return aliveHome.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

// 根据名称模糊查询博客
const getBlogsByBlogTitle = async ({ db, blogTitle }: { db: Database; blogTitle: string }) => {
  const blogs = await db.all(
    "SELECT * FROM home LEFT JOIN users WHERE home.blogTitle LIKE ? AND home.authorId = users.userId AND home.blogState != -1",
    `%${blogTitle}%`
  );
  if (blogs.length) {
    const aliveType = await getAliveType({ db });
    const aliveTag = await getAliveTag({ db });
    return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
  } else {
    return blogs;
  }
};

const getBlogsByBlogTitleAndUserId = async ({ db, blogTitle, userId }: { db: Database; blogTitle: string; userId: string }) => {
  const blogs = await db.all(
    "SELECT * FROM home LEFT JOIN users WHERE home.blogTitle LIKE ? AND home.authorId = ? AND home.authorId = users.userId AND home.blogState != -1",
    `%${blogTitle}%`,
    userId
  );
  if (blogs.length) {
    const aliveType = await getAliveType({ db });
    const aliveTag = await getAliveTag({ db });
    return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
  } else {
    return blogs;
  }
};

// 根据typeId获取博客
const getBlogsByTypeId = async ({ db, typeId }: { db: Database; typeId: string }) => {
  const blogs = await db.all("SELECT * FROM home LEFT JOIN users WHERE home.typeId = ? AND home.authorId = users.userId AND home.blogState != -1", typeId);
  if (blogs.length) {
    const aliveType = await getAliveType({ db });
    const aliveTag = await getAliveTag({ db });
    return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
  } else {
    return blogs;
  }
};

const getBlogsByTypeIdAndUserId = async ({ db, typeId, userId }: { db: Database; typeId: string; userId: string }) => {
  const blogs = await db.all(
    "SELECT * FROM home LEFT JOIN users WHERE home.typeId = ? AND home.authorId = ? AND home.authorId = users.userId AND home.blogState != -1",
    typeId,
    userId
  );
  if (blogs.length) {
    const aliveType = await getAliveType({ db });
    const aliveTag = await getAliveTag({ db });
    return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
  } else {
    return blogs;
  }
};

// 根据tagId获取博客
const getBlogsByTagId = async ({ db, tagId }: { db: Database; tagId: string }) => {
  const allId = tagId.split(",").filter(Boolean);
  const blogs: BlogContentProps[] = [];
  for (let i = 0; i < allId.length; i++) {
    const temp = await db.all(
      "SELECT * FROM home LEFT JOIN users WHERE home.tagId LIKE ? AND home.authorId = users.userId AND home.blogState != -1",
      `%${allId[i]}%`
    );
    temp.forEach((it) => {
      if (blogs.every((blog) => blog.blogId !== it.blogId)) {
        blogs.push(it);
      }
    });
  }
  if (blogs.length) {
    const aliveType = await getAliveType({ db });
    const aliveTag = await getAliveTag({ db });
    return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
  } else {
    return blogs;
  }
};

const getBlogsByTagIdAndUserId = async ({ db, tagId, userId }: { db: Database; tagId: string; userId: string }) => {
  const allId = tagId.split(",").filter(Boolean);
  const blogs: BlogContentProps[] = [];
  for (let i = 0; i < allId.length; i++) {
    const temp = await db.all(
      "SELECT * FROM home LEFT JOIN users WHERE home.tagId LIKE ? AND home.authorId = ? AND home.authorId = users.userId AND home.blogState != -1",
      `%${allId[i]}%`,
      userId
    );
    temp.forEach((it) => {
      if (blogs.every((blog) => blog.blogId !== it.blogId)) {
        blogs.push(it);
      }
    });
  }
  if (blogs.length) {
    const aliveType = await getAliveType({ db });
    const aliveTag = await getAliveTag({ db });
    return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
  } else {
    return blogs;
  }
};

// 根据userId获取个人点赞，收藏等信息
const getUsersExByUserId = async ({ userId, db }: { userId: string; db: Database }) => {
  return await db.get("SELECT * FROM usersEx WHERE userId = ?", userId);
};

// 获取所有type数据
const getType = async ({ db }: { db: Database }) => {
  return await db.all("SELECT * FROM type");
};

// 获取有效的type
const getAliveType = async ({ db }: { db: Database }) => {
  return await db.all("SELECT * FROM type WHERE typeState = 1");
};

// 获取type数量
const getTypeCount = async ({ db }: { db: Database }) => {
  return await db.get("SELECT count(*) FROM type");
};

// 根据typeId获取type数据
const getTypeByTypeId = async ({ db, typeId }: { db: Database; typeId: string }) => {
  return await db.get("SELECT * FROM type WHERE typeId = ?", typeId);
};

// 根据typeContent获取type数据
const getTypeByTypeContent = async ({ db, typeContent }: { db: Database; typeContent: string }) => {
  return await db.get("SELECT * FROM type WHERE typeContent = ?", typeContent);
};

// 获取tag数据
const getTag = async ({ db }: { db: Database }) => {
  return await db.all("SELECT * FROM tag");
};

// 获取有效的tag
const getAliveTag = async ({ db }: { db: Database }) => {
  return await db.all("SELECT * FROM tag WHERE tagState = 1");
};

// 获取tag数量
const getTagCount = async ({ db }: { db: Database }) => {
  return await db.get("SELECT count(*) FROM tag");
};

// 根据tagId获取tag数据
const getTagByTagId = async ({ db, tagId }: { db: Database; tagId: string }) => {
  return await db.get("SELECT * FROM tag WHERE tagId = ?", tagId);
};

// 根据tagContent获取tag数据
const getTagByTagContent = async ({ db, tagContent }: { db: Database; tagContent: string }) => {
  return await db.get("SELECT * FROM tag WHERE tagContent = ?", tagContent);
};

// 根据blogId获取详细的blog数据
const getBlogByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  const blog = await db.get("SELECT * FROM blogs LEFT JOIN users WHERE blogId = ? AND blogs.authorId = users.userId", blogId);
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return mergeTypeTagToBlog(blog, aliveType, aliveTag);
};

// 获取总的博客数
const getBlogCount = async ({ db }: { db: Database }) => {
  return await db.get("SELECT COUNT(*) FROM blogs");
};

// 获取有效的博客数
const getAliveBlogCount = async ({ db }: { db: Database }) => {
  return await db.get("SELECT COUNT(*) FROM blogs WHERE blogState != -1");
};

// 获取主评论
const getPrimaryByBlogId = async ({ db, blogId }: { db: Database; blogId: string }): Promise<PrimaryMessageProps[]> => {
  return await db.all("SELECT * FROM primaryComment LEFT JOIN users ON primaryComment.fromUserId = users.userId WHERE primaryComment.blogId = ?", blogId);
};

const getPrimaryByCommentId = async ({ db, commentId }: { db: Database; commentId: string }): Promise<PrimaryMessageProps | undefined> => {
  return await db.get("SELECT * FROM primaryComment WHERE commentId = ?", commentId);
};

// 获取子评论
const getChildByPrimaryId = async ({ db, primaryCommentId }: { db: Database; primaryCommentId: string }): Promise<ChildMessageProps[]> => {
  const childMessage = await db.all(
    "SELECT * FROM childComment LEFT JOIN users ON childComment.fromUserId = users.userId WHERE childComment.primaryCommentId = ?",
    primaryCommentId
  );
  for (let key in childMessage) {
    const { toUserId } = childMessage[key];
    if (toUserId) {
      const user = await getUserByUserId({ db, userId: toUserId });
      if (user) {
        childMessage[key]["toUserName"] = user.username;
      }
    }
  }
  return childMessage;
};

const getChildByCommentId = async ({ db, commentId }: { db: Database; commentId: string }): Promise<ChildMessageProps | undefined> => {
  return await db.get("SELECT * FROM childComment WHERE commentId = ?", commentId);
};

const getChildByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.all("SELECT * FROM childComment LEFT JOIN users ON childComment.fromUserId = users.userId WHERE childComment.blogId = ?", blogId);
};

const getAuthorByUserId = async ({ db, userId }: { db: Database; userId: string }) => {
  return await db.get("SELECT * FROM author WHERE userId = ?", userId);
};

export { getUserByUser, getAliveBlogCount, getAliveTag, getBlogCount, getBlogByBlogId, getChildByPrimaryId, getHome, getPrimaryByBlogId, getTag };

export {
  getTypeByTypeContent,
  getTagByTagContent,
  getAliveType,
  getTagByTagId,
  getTagCount,
  getType,
  getTypeByTypeId,
  getTypeCount,
  getUserByUserId,
  getUserByUserName,
};

export { getUserCount, getUsersExByUserId, getBlogsByBlogTitle, getBlogsByTypeId, getBlogsByTagId, getChildByBlogId, getBlogsByBlogTitleAndUserId };

export { getBlogsByTypeIdAndUserId, getBlogsByTagIdAndUserId, getHomeByUserId, getAuthorByUserId, getPrimaryByCommentId, getChildByCommentId };
