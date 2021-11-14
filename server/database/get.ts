import { Database } from "sqlite";
import { mergeTypeTagToBlog } from "server/utils/merge";
import { AuthorProps, BlogProps, ChildCommentProps, HomeBlogProps, PrimaryCommentProps, ServerTagProps, TypeProps, UserProps, UsersExProps } from "types";

// 根据用户名与密码获取用户信息
export const getUserByUser = async ({ username, password, db }: { username: string; password: string; db: Database }) => {
  return await db.get<UserProps>("SELECT rowid as id, * FROM users WHERE username = ? AND password = ?", username, password);
};

// 根据用户id获取用户信息
export const getUserByUserId = async ({ userId, db }: { userId: string; db: Database }) => {
  return await db.get<UserProps>("SELECT * FROM users WHERE users.userId = ?", userId);
};

// 根据用户名获取用户信息
export const getUserByUserName = async ({ userName, db }: { userName: string; db: Database }) => {
  return await db.get<UserProps>("SELECT * FROM users WHERE users.username = ?", userName);
};

// 获取总的用户数
export const getUserCount = async ({ db }: { db: Database }) => {
  return await db.get<number>("SELECT COUNT(*) FROM users");
};

// 获取home数据
export const getHome = async ({ db }: { db: Database }) => {
  const aliveHome = await db.all<Array<HomeBlogProps & UserProps>>(
    "SELECT * FROM home LEFT JOIN users WHERE home.authorId = users.userId AND home.blogState != -1"
  );
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return aliveHome.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

export const getHomeByUserId = async ({ db, userId }: { db: Database; userId: string }) => {
  const aliveHome = await db.all<Array<HomeBlogProps & UserProps>>(
    "SELECT * FROM home LEFT JOIN users WHERE home.authorId = ? And home.authorId = users.userId AND home.blogState != -1",
    userId
  );
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return aliveHome.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

// 根据名称模糊查询博客
export const getBlogsByBlogTitle = async ({ db, blogTitle }: { db: Database; blogTitle: string }) => {
  const blogs = await db.all<Array<HomeBlogProps & UserProps>>(
    "SELECT * FROM home LEFT JOIN users WHERE home.blogTitle LIKE ? AND home.authorId = users.userId AND home.blogState != -1",
    `%${blogTitle}%`
  );
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

export const getBlogsByBlogTitleAndUserId = async ({ db, blogTitle, userId }: { db: Database; blogTitle: string; userId: string }) => {
  const blogs = await db.all<Array<HomeBlogProps & UserProps>>(
    "SELECT * FROM home LEFT JOIN users WHERE home.blogTitle LIKE ? AND home.authorId = ? AND home.authorId = users.userId AND home.blogState != -1",
    `%${blogTitle}%`,
    userId
  );
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

// 根据typeId获取博客
export const getBlogsByTypeId = async ({ db, typeId }: { db: Database; typeId: string }) => {
  const blogs = await db.all<Array<HomeBlogProps & UserProps>>(
    "SELECT * FROM home LEFT JOIN users WHERE home.typeId = ? AND home.authorId = users.userId AND home.blogState != -1",
    typeId
  );
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

export const getBlogsByTypeIdAndUserId = async ({ db, typeId, userId }: { db: Database; typeId: string; userId: string }) => {
  const blogs = await db.all<Array<HomeBlogProps & UserProps>>(
    "SELECT * FROM home LEFT JOIN users WHERE home.typeId = ? AND home.authorId = ? AND home.authorId = users.userId AND home.blogState != -1",
    typeId,
    userId
  );

  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

// 根据tagId获取博客
export const getBlogsByTagId = async ({ db, tagId }: { db: Database; tagId: string }) => {
  const allId = tagId.split(",").filter(Boolean);
  const blogs: Array<HomeBlogProps & UserProps> = [];
  for (let i = 0; i < allId.length; i++) {
    const temp = await db.all<Array<HomeBlogProps & UserProps>>(
      "SELECT * FROM home LEFT JOIN users WHERE home.tagId LIKE ? AND home.authorId = users.userId AND home.blogState != -1",
      `%${allId[i]}%`
    );
    temp.forEach((it) => {
      if (blogs.every((blog) => blog.blogId !== it.blogId)) {
        blogs.push(it);
      }
    });
  }
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

export const getBlogsByTagIdAndUserId = async ({ db, tagId, userId }: { db: Database; tagId: string; userId: string }) => {
  const allId = tagId.split(",").filter(Boolean);
  const blogs: Array<HomeBlogProps & UserProps> = [];
  for (let i = 0; i < allId.length; i++) {
    const temp = await db.all<Array<HomeBlogProps & UserProps>>(
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
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blogs.map((item) => mergeTypeTagToBlog(item, aliveType, aliveTag));
};

// 根据userId获取个人点赞，收藏等信息
export const getUsersExByUserId = async ({ userId, db }: { userId: string; db: Database }) => {
  return await db.get<UsersExProps>("SELECT * FROM usersEx WHERE userId = ?", userId);
};

// 获取所有type数据
export const getType = async ({ db }: { db: Database }) => {
  return await db.all<TypeProps[]>("SELECT * FROM type");
};

// 获取有效的type
export const getAliveType = async ({ db }: { db: Database }) => {
  let cache: TypeProps[] | null = null;
  let timer = false;
  if (cache) {
    return cache;
  } else {
    cache = await db.all<TypeProps[]>("SELECT * FROM type WHERE typeState = 1");
    if (!timer) {
      timer = true;
      setTimeout(() => {
        timer = false;
        cache = null;
      }, 1000 * 60 * 3);
    }
    return cache;
  }
};

// 获取type数量
export const getTypeCount = async ({ db }: { db: Database }) => {
  return await db.get<number>("SELECT count(*) FROM type");
};

// 根据typeId获取type数据
export const getTypeByTypeId = async ({ db, typeId }: { db: Database; typeId: string }) => {
  return await db.get<TypeProps>("SELECT * FROM type WHERE typeId = ?", typeId);
};

// 根据typeContent获取type数据
export const getTypeByTypeContent = async ({ db, typeContent }: { db: Database; typeContent: string }) => {
  return await db.get<TypeProps>("SELECT * FROM type WHERE typeContent = ?", typeContent);
};

// 获取tag数据
export const getTag = async ({ db }: { db: Database }) => {
  return await db.all<ServerTagProps[]>("SELECT * FROM tag");
};

// 获取有效的tag
export const getAliveTag = async ({ db }: { db: Database }) => {
  let cache: ServerTagProps[] | null = null;
  let timer = false;
  if (cache) {
    return cache;
  } else {
    cache = await db.all<ServerTagProps[]>("SELECT * FROM tag WHERE tagState = 1");
    if (!timer) {
      timer = true;
      setTimeout(() => {
        timer = false;
        cache = null;
      }, 1000 * 60 * 3);
    }
    return cache;
  }
};

// 获取tag数量
export const getTagCount = async ({ db }: { db: Database }) => {
  return await db.get<number>("SELECT count(*) FROM tag");
};

// 根据tagId获取tag数据
export const getTagByTagId = async ({ db, tagId }: { db: Database; tagId: string }) => {
  return await db.get<ServerTagProps>("SELECT * FROM tag WHERE tagId = ?", tagId);
};

// 根据tagContent获取tag数据
export const getTagByTagContent = async ({ db, tagContent }: { db: Database; tagContent: string }) => {
  return await db.get<ServerTagProps>("SELECT * FROM tag WHERE tagContent = ?", tagContent);
};

// 根据blogId获取详细的blog数据
export const getBlogByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  const blog = await db.get<BlogProps & UserProps>("SELECT * FROM blogs LEFT JOIN users WHERE blogId = ? AND blogs.authorId = users.userId", blogId);
  const aliveType = await getAliveType({ db });
  const aliveTag = await getAliveTag({ db });
  return blog ? mergeTypeTagToBlog(blog, aliveType, aliveTag) : null;
};

// 获取总的博客数
export const getBlogCount = async ({ db }: { db: Database }) => {
  return await db.get<number>("SELECT COUNT(*) FROM blogs");
};

// 获取有效的博客数
export const getAliveBlogCount = async ({ db }: { db: Database }) => {
  return await db.get<number>("SELECT COUNT(*) FROM blogs WHERE blogState != -1");
};

// 获取主评论
export const getPrimaryByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.all<Array<PrimaryCommentProps & UserProps>>(
    "SELECT * FROM primaryComment LEFT JOIN users ON primaryComment.fromUserId = users.userId WHERE primaryComment.blogId = ?",
    blogId
  );
};

export const getPrimaryByCommentId = async ({ db, commentId }: { db: Database; commentId: string }) => {
  return await db.get<PrimaryCommentProps>("SELECT * FROM primaryComment WHERE commentId = ?", commentId);
};

// 获取子评论
export const getChildByPrimaryId = async ({ db, primaryCommentId }: { db: Database; primaryCommentId: string }) => {
  const childMessage = await db.all<Array<ChildCommentProps & UserProps & { toUserName: string }>>(
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

export const getChildByCommentId = async ({ db, commentId }: { db: Database; commentId: string }) => {
  return await db.get<ChildCommentProps>("SELECT * FROM childComment WHERE commentId = ?", commentId);
};

export const getChildByBlogId = async ({ db, blogId }: { db: Database; blogId: string }) => {
  return await db.all<Array<ChildCommentProps & UserProps>>(
    "SELECT * FROM childComment LEFT JOIN users ON childComment.fromUserId = users.userId WHERE childComment.blogId = ?",
    blogId
  );
};

export const getAuthorByUserId = async ({ db, userId }: { db: Database; userId: string }) => {
  return await db.get<AuthorProps>("SELECT * FROM author WHERE userId = ?", userId);
};
