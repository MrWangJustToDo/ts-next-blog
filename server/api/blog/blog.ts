import { apiName } from "config/api";
import { transformPath } from "utils/path";
import { ServerError } from "server/utils/error";
import { insertBlog, insertHome } from "server/database/insert";
import { success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";
import { getBlogByBlogId, getTagByTagId, getTypeByTypeId } from "server/database/get";
import { updateTableWithParam, updateTagCountByTagId, updateTypeCountByTypeId } from "server/database/update";
import { deleteBlogByBlogId, deleteChildMessageByBlogId, deleteHomeByBlogId, deletePrimaryMessageByBlogId } from "server/database/delete";

// 根据id获取blog
export const getBlogByBlogIdAction = wrapperMiddlewareRequest({
  requestHandler: async function getBlogByBlogIdAction({ req, res }) {
    const blogId = <string>req.query.blogId;
    const data = await getBlogByBlogId({ db: req.db!, blogId });
    success({ res, statusCode: 200, resDate: { data } });
  },
  cacheConfig: {
    needCache: true,
    cacheKey: ({ req }) => transformPath({ apiPath: apiName.blog, query: { blogId: req.query.blogId as string }, needPre: false }),
  },
  paramsConfig: { fromQuery: ["blogId"] },
});

// 发布一个新的blog
export const publishBlogAction = wrapperMiddlewareRequest({
  requestHandler: async function publishBlogAction({ req, res }) {
    const { blogId, blogOriginState, blogTitle, blogContent, typeId, tagId, blogImgLink, blogState, blogPriseState, blogCommentState, blogPreview } = req.body;
    const tagIdArr = typeof tagId === "string" ? tagId.split(",") : tagId;
    if (!Array.isArray(tagIdArr)) {
      throw new ServerError(`tagId参数类型错误, tagId: ${tagId}`, 401);
    }
    // 获取当前type
    const type = await getTypeByTypeId({ db: req.db!, typeId });
    if (!type) {
      throw new ServerError(`typeId不合法, typeId: ${typeId}`, 404);
    }
    const tagArr = [];
    // 增加type
    for (let id of tagIdArr) {
      const tag = await getTagByTagId({ db: req.db!, tagId: id });
      if (!tag) {
        throw new ServerError(`tagId不合法, tagId: ${id}`, 404);
      }
      tagArr.push(tag);
    }
    await updateTypeCountByTypeId({ db: req.db!, typeId, count: type.typeCount + 1 });
    for (let tagProps of tagArr) {
      await updateTagCountByTagId({ db: req.db!, tagId: tagProps.tagId, count: tagProps.tagCount + 1 });
    }
    // 增加blog
    const now = new Date();
    const authorId = req.user?.userId || "admin";
    const blogIdStr = blogId || now.getTime().toString(36);
    const blogCreateDate = now.toLocaleString();
    const blogCreateYear = String(now.getFullYear());
    const blogModifyDate = now.toLocaleString();
    const blogModifyState = 0;
    const blogAssentCount = 0;
    const blogCollectCount = 0;
    const blogReadCount = 0;
    // 增加blog
    await insertBlog({
      db: req.db!,
      authorId,
      blogId: blogIdStr,
      blogState: Number(blogState),
      blogOriginState: Number(blogOriginState),
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
      blogPriseState: Number(blogPriseState === "on"),
      blogCommentState: Number(blogCommentState === "on"),
      typeId,
      tagId,
    });
    // 增加home
    await insertHome({
      db: req.db!,
      authorId,
      blogId: blogIdStr,
      blogState: Number(blogState),
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
    });
    success({ res, statusCode: 200, resDate: { state: "创建博客成功", data: `博客id：${blogIdStr}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDeleteAfterRequest: [
      apiName.home,
      apiName.type,
      apiName.tag,
      ({ req }) => transformPath({ apiPath: apiName.userHome, query: { userId: req.query.userId as string }, needPre: false }),
    ],
  },
  paramsConfig: {
    fromQuery: ["userId"],
    fromBody: [
      "blogOriginState",
      "blogTitle",
      "blogContent",
      "typeId",
      "tagId",
      "blogImgLink",
      "blogState",
      "blogPriseState",
      "blogCommentState",
      "blogPreview",
    ],
  },
});

// 根据id删除blog
export const deleteBlogByBlogIdAAction = wrapperMiddlewareRequest({
  requestHandler: async function deleteBlogByBlogIdAAction({ req, res }) {
    const { blogId, typeId, tagId } = req.body;
    // 判断
    let tagIdArr = typeof tagId === "string" ? tagId.split(",") : tagId;
    if (!Array.isArray(tagIdArr)) {
      throw new ServerError(`tagId的参数不正确, tagId: ${tagId}`, 401);
    }
    let tagArr = [];
    for (let id of tagIdArr) {
      const tag = await getTagByTagId({ db: req.db!, tagId: id });
      if (!tag) {
        throw new ServerError(`tagId不合法, tagId: ${id}`, 404);
      }
      tagArr.push(tag);
    }
    const type = await getTypeByTypeId({ db: req.db!, typeId });
    if (!type) {
      throw new ServerError(`typeId不合法, typeId: ${typeId}`, 404);
    }
    const blog = await getBlogByBlogId({ db: req.db!, blogId });
    if (!blog) {
      throw new ServerError(`blogId不合法, blogId: ${blogId}`, 404);
    }

    // 更新
    // 减少tag
    for (let tagProps of tagArr) {
      await updateTagCountByTagId({ db: req.db!, tagId: tagProps.tagId!, count: tagProps.tagCount! - 1 });
    }
    // 减少type
    await updateTypeCountByTypeId({ db: req.db!, typeId, count: type.typeCount - 1 });
    // 删除所有评论
    await deleteChildMessageByBlogId({ db: req.db!, blogId });
    await deletePrimaryMessageByBlogId({ db: req.db!, blogId });
    // 删除blog
    await deleteBlogByBlogId({ db: req.db!, blogId });
    // 删除home
    await deleteHomeByBlogId({ db: req.db!, blogId });
    success({ res, resDate: { state: "删除博客成功", data: "删除博客成功" } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [
      apiName.home,
      apiName.tag,
      apiName.type,
      ({ req }) => transformPath({ apiPath: apiName.blog, query: { blogId: req.body.blogId }, needPre: false }),
    ],
  },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["blogId", "typeId", "tagId"] },
});

// 根据id更新blog
export const updateBlogByBlogIdAction = wrapperMiddlewareRequest({
  requestHandler: async function updateBlogByBlogIdAction({ req, res }) {
    const now = new Date();
    const { oldProps, newProps } = req.body;
    // update type
    if (oldProps.typeId !== newProps.typeId) {
      // 获取type
      const oldType = await getTypeByTypeId({ db: req.db!, typeId: oldProps.typeId });
      // 获取type
      const newType = await getTypeByTypeId({ db: req.db!, typeId: newProps.typeId });
      if (!oldType) {
        throw new ServerError(`oldType不合法, typeId: ${oldProps.typeId}`, 404);
      }
      if (!newType) {
        throw new ServerError(`newType不合法, typeId: ${newProps.typeId}`, 404);
      }
      // 减少type
      await updateTypeCountByTypeId({ db: req.db!, typeId: oldProps.typeId, count: oldType.typeCount - 1 });
      // 增加type
      await updateTypeCountByTypeId({ db: req.db!, typeId: newProps.typeId, count: newType.typeCount + 1 });
    }
    // update tag
    const oldTagIdArr = typeof oldProps.tagId === "string" ? oldProps.tagId.split(",") : oldProps.tagId;
    const newTagIdArr = typeof newProps.tagId === "string" ? newProps.tagId.split(",") : newProps.tagId;
    if (!Array.isArray(oldTagIdArr)) {
      throw new ServerError(`oldTagId类型错误, oldTagId: ${oldProps.tagId}`, 403);
    }
    if (!Array.isArray(newTagIdArr)) {
      throw new ServerError(`newTagId类型错误, newTagId: ${newProps.tagId}`, 403);
    }
    oldTagIdArr.sort();
    newTagIdArr.sort();
    let newIndex = 0;
    for (let i = 0; i < oldTagIdArr.length; i++) {
      if (oldTagIdArr[i] === newTagIdArr[newIndex]) {
        newIndex++;
      } else {
        const tag = await getTagByTagId({ db: req.db!, tagId: oldTagIdArr[i] });
        tag && (await updateTagCountByTagId({ db: req.db!, tagId: oldTagIdArr[i], count: tag.tagCount - 1 }));
      }
    }
    for (let j = newIndex; j < newTagIdArr.length; j++) {
      const tag = await getTagByTagId({ db: req.db!, tagId: newTagIdArr[j] });
      tag && (await updateTagCountByTagId({ db: req.db!, tagId: newTagIdArr[j], count: tag.tagCount + 1 }));
    }
    // 进行更新
    const { blogId, blogState, blogPriseState, blogCommentState, blogOriginState, blogTitle, blogImgLink, blogPreview, typeId, tagId, ...resProps } = newProps;
    await updateTableWithParam({
      db: req.db!,
      table: "blogs",
      param: {
        set: {
          ...resProps,
          tagId,
          typeId,
          blogTitle,
          blogImgLink,
          blogPreview,
          blogModifyState: 1,
          blogState: Number(blogState),
          blogModifyDate: now.toLocaleString(),
          blogOriginState: Number(blogOriginState),
          blogPriseState: Number(blogPriseState === "on"),
          blogCommentState: Number(blogCommentState === "on"),
        },
        where: { blogId: { value: blogId } },
      },
    });
    await updateTableWithParam({
      db: req.db!,
      table: "home",
      param: {
        set: {
          tagId,
          typeId,
          blogTitle,
          blogImgLink,
          blogPreview,
          blogState: Number(blogState),
        },
        where: { blogId: { value: blogId } },
      },
    });
    success({ res, resDate: { state: "更新博客成功", data: `更新blog成功, id: ${blogId}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [
      apiName.home,
      apiName.tag,
      apiName.type,
      ({ req }) => transformPath({ apiPath: apiName.blog, query: { blogId: req.body.newProps.blogId }, needPre: false }),
    ],
  },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["oldProps", "newProps"] },
});

export const updateBlogByBlogIdAction_v2 = wrapperMiddlewareRequest({
  requestHandler: async function updateBlogByBlogIdAction_v2({ req, res }) {
    const now = new Date();
    const { oldProps, newProps } = req.body;
    // 更新type
    if (oldProps.typeId !== newProps.typeId) {
      // 获取type
      const oldType = await getTypeByTypeId({ db: req.db!, typeId: oldProps.typeId });
      // 获取type
      const newType = await getTypeByTypeId({ db: req.db!, typeId: newProps.typeId });
      if (!oldType) {
        throw new ServerError(`oldType不合法, typeId: ${oldProps.typeId}`, 404);
      }
      if (!newType) {
        throw new ServerError(`newType不合法, typeId: ${newProps.typeId}`, 404);
      }
      // 减少type
      await updateTypeCountByTypeId({ db: req.db!, typeId: oldProps.typeId, count: oldType.typeCount - 1 });
      // 增加type
      await updateTypeCountByTypeId({ db: req.db!, typeId: newProps.typeId, count: newType.typeCount + 1 });
    }
    // 更新tag
    if (oldProps.tagId && newProps.tagId) {
      const deleteTagId = oldProps.tagId.filter((id: string) => newProps.tagId.every((_id: string) => _id !== id));
      const addTagId = newProps.tagId.filter((id: string) => oldProps.tagId.every((_id: string) => _id !== id));
      for (const id of deleteTagId) {
        const tag = await getTagByTagId({ db: req.db!, tagId: id });
        tag && (await updateTagCountByTagId({ db: req.db!, tagId: id, count: tag.tagCount - 1 }));
      }
      for (const id of addTagId) {
        const tag = await getTagByTagId({ db: req.db!, tagId: id });
        tag && (await updateTagCountByTagId({ db: req.db!, tagId: id, count: tag.tagCount + 1 }));
      }
    }
    const { blogId, tagId, ...resProps } = newProps;
    const rowTagId = tagId?.join(",");
    await updateTableWithParam({
      db: req.db!,
      table: "blogs",
      param: {
        set: {
          tagId: rowTagId,
          blogModifyState: 1,
          blogModifyDate: now.toLocaleString(),
          ...resProps,
        },
        where: { blogId: { value: blogId } },
      },
    });
    await updateTableWithParam({
      db: req.db!,
      table: "home",
      param: {
        set: {
          tagId: rowTagId,
          ...resProps,
        },
        where: { blogId: { value: blogId } },
      },
    });
    success({ res, resDate: { state: "更新博客成功", data: `更新blog成功, id: ${blogId}` } });
  },
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDeleteAfterRequest: [
      apiName.home,
      apiName.tag,
      apiName.type,
      ({ req }) => transformPath({ apiPath: apiName.blog, query: { blogId: req.body.newProps.blogId }, needPre: false }),
      ({ req }) => transformPath({ apiPath: apiName.userHome, query: { userId: req.body.userId }, needPre: false }),
    ],
  },
  paramsConfig: { fromQuery: ["userId"], fromBody: ["oldProps", "newProps"] },
});

// 更新博客阅读数量
export const updateBlogReadAction = wrapperMiddlewareRequest({
  requestHandler: async function updateBlogReadAction({ req, res }) {
    const { blogId } = req.body;
    const blog = await getBlogByBlogId({ db: req.db!, blogId });
    if (!blog) {
      throw new ServerError(`blogIg不合法, blogId: ${blogId}`, 403);
    }
    await updateTableWithParam({ db: req.db!, table: "home", param: { set: { blogReadCount: blog.blogReadCount + 1 }, where: { blogId: { value: blogId } } } });
    await updateTableWithParam({
      db: req.db!,
      table: "blogs",
      param: { set: { blogReadCount: blog.blogReadCount + 1 }, where: { blogId: { value: blogId } } },
    });
    success({ res, resDate: { data: "更新readCount成功" } });
  },
  cacheConfig: { needDelete: [apiName.home] },
  paramsConfig: { fromBody: ["blogId"] },
});
