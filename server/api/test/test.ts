import {
  insertAuthor,
  insertBlog,
  insertChildComment,
  insertHome,
  insertPrimaryComment,
  insertTag,
  insertType,
  insertUser,
  insertUserEx,
} from "server/database/insert";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

const test_publishBlog = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertBlog({
      db: req.db!,
      authorId: "1",
      blogId: "1",
      blogState: 3,
      blogOriginState: 1,
      blogTitle: "Test Blog",
      blogImgLink: "https://h2.ioliu.cn/bing/FreshSalt_ZH-CN12818759319_1920x1080.jpg",
      blogCreateDate: new Date().toLocaleString(),
      blogModifyState: 0,
      blogModifyDate: new Date().toLocaleString(),
      blogPreview: "this is my first blog",
      blogContent: "this is my first blog content",
      blogAssentCount: 1,
      blogCollectCount: 1,
      blogReadCount: 1,
      blogPriseState: 1,
      blogCommentState: 1,
      typeId: "1",
      tagId: "1" as any,
    });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_registerUser = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertUser({
      db: req.db!,
      ip: "127.0.0.1",
      userId: "1",
      userState: 1,
      username: "mrwang",
      password: "099647",
      nickname: "王老师说过",
      address: "广州 深圳",
      avatar: "",
      email: "2711470541@qq.com",
      gender: 0,
      qq: "2711470541",
    });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_publishHome = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertHome({
      db: req.db!,
      authorId: "1",
      blogId: "1",
      blogState: 3,
      blogTitle: "Test Blog",
      blogCreateDate: new Date().toLocaleString(),
      blogCreateYear: "2020",
      blogImgLink: "https://h2.ioliu.cn/bing/FreshSalt_ZH-CN12818759319_1920x1080.jpg",
      blogPreview: "blog content",
      blogAssentCount: 1,
      blogCollectCount: 1,
      blogReadCount: 1,
      typeId: "1",
      tagId: "1",
    });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_insertUserEx = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertUserEx({ db: req.db!, userId: "1", collect: 0, assent: 0, publish: 1, collectIds: "", assentIds: "" });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_insertType = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertType({ db: req.db!, typeId: "1", typeState: 1, typeContent: "java", typeCount: 1 });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_insertTag = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertTag({ db: req.db!, tagId: "1", tagState: 1, tagContent: "前端", tagCount: 1 });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_primaryComment = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertPrimaryComment({
      db: req.db!,
      blogId: "1",
      commentId: "1",
      fromUserId: "1",
      fromIp: "127.0.0.1",
      content: "test content",
      createDate: new Date().toLocaleString(),
      modifyState: 0,
      modifyDate: new Date().toLocaleString(),
      childIds: "1",
      childCount: 1,
    });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_childComment = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertChildComment({
      db: req.db!,
      blogId: "1",
      primaryCommentId: "1",
      commentId: "1",
      fromIp: "127.0.0.1",
      fromUserId: "1",
      toIp: "127.0.0.1",
      toUserId: "1",
      content: "test child",
      createDate: new Date().toLocaleString(),
      modifyState: 0,
      modifyDate: new Date().toLocaleString(),
    });
    success({ res, resDate: { data: "ok" } });
  },
});

const test_author = wrapperMiddlewareRequest({
  requestHandler: async ({ req, res }) => {
    await insertAuthor({
      db: req.db!,
      userId: "1",
      userAlipay: "/avatar/aliPay.jpg",
      userWechat: "/avatar/weichatPay.png",
      cacheState: 0,
    });
    success({ res, resDate: { data: "ok" } });
  },
});

export {
  test_insertTag,
  test_childComment,
  test_insertType,
  test_insertUserEx,
  test_primaryComment,
  test_publishBlog,
  test_publishHome,
  test_registerUser,
  test_author,
};
