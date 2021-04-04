import { apiName } from "config/api";
import { ServerError } from "server/utils/error";
import { insertBlog, insertHome } from "server/database/insert";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { getBlogByBlogId, getTagByTagId, getTypeByTypeId } from "server/database/get";
import { updateTableWithParam, updateTagCountByTagId, updateTypeCountByTypeId } from "server/database/updata";
import { deleteBlogByBlogId, deleteChildMessageByBlogId, deleteHomeByBlogId, deletePrimaryMessageByBlogId } from "server/database/delete";
import { TagProps } from "types/containers";
import { transformPath } from "utils/path";

// 根据id获取blog
const getBlogByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    if (req.query.blogId === undefined) {
      throw new ServerError("博客id为空", 400);
    } else {
      const blogId = <string>req.query.blogId;
      const data = await getBlogByBlogId({ db: req.db!!, blogId });
      return success({ res, statuCode: 200, resDate: { data } });
    }
  },
  errorHandler: ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getBlogByBlogIdAction" } }),
  cacheConfig: { needCache: true },
});

// 发布一个新的blog
const publishBlogAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogId, blogOriginState, blogTitle, blogContent, typeId, tagId, blogImgLink, blogState, blogPriseState, blogCommentState, blogPreview } = req.body;
    if (!typeId) {
      throw new ServerError("typeId参数不存在", 403);
    }
    if (!tagId) {
      throw new ServerError("tagId参数不存在", 403);
    }
    // 获取当前type
    const type = await getTypeByTypeId({ db: req.db!, typeId });
    // 增加type
    await updateTypeCountByTypeId({ db: req.db!, typeId, count: type.typeCount + 1 });
    const tagIdArr = typeof tagId === "string" ? tagId.split(",") : tagId;
    if (!Array.isArray(tagIdArr)) {
      throw new ServerError(`tagId参数类型错误, tagId: ${tagId}`, 401);
    }
    for (let id of tagIdArr) {
      const tag = await getTagByTagId({ db: req.db!, tagId: id });
      await updateTagCountByTagId({ db: req.db!, tagId: id, count: tag.tagCount + 1 });
    }
    // 增加blog
    const now = new Date();
    const authorId = req.user.userId;
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
    success({ res, statuCode: 200, resDate: { state: "创建博客成功", data: `博客id：${blogIdStr}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "创建博客失败", data: e.toString(), methodName: "publishBlogAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: [apiName.home, apiName.type, apiName.tag] },
});

// 根据id删除blog
const deleteBlogByBlogIdAAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const { blogId, typeId, tagId } = req.body;
    if (!typeId) {
      throw new ServerError("typeId参数不存在", 403);
    }
    if (!tagId) {
      throw new ServerError("tagId参数不存在", 403);
    }
    let tagIdArr = typeof tagId === "string" ? tagId.split(",") : tagId;
    if (!Array.isArray(tagIdArr)) {
      throw new ServerError(`tagId的参数不正确, tagId: ${tagId}`, 401);
    }
    for (let id of tagIdArr) {
      const tag = <TagProps>await getTagByTagId({ db: req.db!, tagId: id });
      await updateTagCountByTagId({ db: req.db!, tagId, count: tag.tagCount! - 1 });
    }
    // 获取当前type
    const type = await getTypeByTypeId({ db: req.db!, typeId });
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
  errorHandler: ({ res, e, code = 400 }) =>
    fail({ res, statuCode: code, resDate: { state: "删除博客失败", data: e.toString(), methodName: "deleteBlogByBlogIdAAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: { needDelete: [apiName.home, apiName.tag, apiName.type] },
});

// 根据id更新blog
const updateBlogByBlogIdAction = autoRequestHandler({
  requestHandler: async ({ req, res }) => {
    const now = new Date();
    const { oldProps, newProps } = req.body;
    // update type
    if (oldProps.typeId !== newProps.typeId) {
      // 获取type
      const oldType = await getTypeByTypeId({ db: req.db!, typeId: oldProps.typeId });
      console.log(oldType);
      // 减少type
      await updateTypeCountByTypeId({ db: req.db!, typeId: oldProps.typeId, count: oldType.typeCount - 1 });
      // 获取type
      const newType = await getTypeByTypeId({ db: req.db!, typeId: newProps.typeId });
      console.log(newType);
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
        await updateTagCountByTagId({ db: req.db!, tagId: oldTagIdArr[i], count: tag.tagCount - 1 });
      }
    }
    for (let j = newIndex; j < newTagIdArr.length; j++) {
      const tag = await getTagByTagId({ db: req.db!, tagId: newTagIdArr[j] });
      await updateTagCountByTagId({ db: req.db!, tagId: newTagIdArr[j], count: tag.tagCount + 1 });
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
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "更新博客失败", data: e.toString(), methodName: "updateBlogByBlogIdAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
  cacheConfig: {
    needDelete: [
      apiName.home,
      apiName.tag,
      apiName.type,
      ({ req }) => transformPath({ apiPath: apiName.blog, query: { blogId: req.body.newProps.blogId }, needPre: false }),
    ],
  },
});

export { updateBlogByBlogIdAction, getBlogByBlogIdAction, publishBlogAction, deleteBlogByBlogIdAAction };
