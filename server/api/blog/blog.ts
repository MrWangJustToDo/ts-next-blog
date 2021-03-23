import { apiName } from "config/api";
import { ServerError } from "server/utils/error";
import { insertBlog, insertHome } from "server/database/insert";
import { autoRequestHandler, success, fail } from "server/middleware/apiHandler";
import { getBlogByBlogId, getTagByTagId, getTypeByTypeId } from "server/database/get";
import { deleteBlogByBlogIdWithBlogState, deleteHomeByBlogIdWithBlogState } from "server/database/delete";
import { updateTableWithParam, updateTagCountByTagId, updateTypeCountByTypeId } from "server/database/updata";

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
    const { blogOriginState, blogTitle, blogContent, typeId, tagId, blogImgLink, blogState, blogPriseState, blogCommentState, blogPreview } = req.body;
    if (typeId) {
      // 获取当前type
      const type = await getTypeByTypeId({ db: req.db!, typeId });
      // 增加type
      await updateTypeCountByTypeId({ db: req.db!, typeId, count: type.typeCount + 1 });
    }
    if (tagId) {
      const tagIdArr = tagId.split(",");
      for (let id of tagIdArr) {
        const tag = await getTagByTagId({ db: req.db!, tagId: id });
        await updateTagCountByTagId({ db: req.db!, tagId, count: tag.tagCount + 1 });
      }
    }
    // 增加blog
    const now = new Date();
    const authorId = req.user.userId;
    const blogId = now.getTime().toString(36);
    const blogCreateDate = now.toLocaleString();
    const blogCreateYear = String(now.getFullYear());
    const blogModifyDate = now.toLocaleString();
    const blogModifyState = 0;
    const blogAssentCount = 0;
    const blogCollectCount = 0;
    const blogReadCount = 0;
    const blogPriseStateNum = Number(blogPriseState === "on");
    const blogCommentStateNum = Number(blogCommentState === "on");
    // 增加blog
    await insertBlog({
      db: req.db!,
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
      blogPriseState: blogPriseStateNum,
      blogCommentState: blogCommentStateNum,
      typeId,
      tagId,
    });
    // 增加home
    await insertHome({
      db: req.db!,
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
    });
    success({ res, statuCode: 200, resDate: { state: "创建博客成功", data: `博客id：${now.getTime().toString(36)}` } });
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
    if (tagId) {
      const tagIdArr = tagId.split(",");
      for (let id of tagIdArr) {
        const tag = await getTagByTagId({ db: req.db!, tagId: id });
        await updateTagCountByTagId({ db: req.db!, tagId, count: tag.tagCount - 1 });
      }
    }
    if (typeId) {
      // 获取当前type
      const type = await getTypeByTypeId({ db: req.db!, typeId });
      // 减少type
      await updateTypeCountByTypeId({ db: req.db!, typeId, count: type.typeCount - 1 });
    }
    // 删除blog
    await deleteBlogByBlogIdWithBlogState({ db: req.db!, blogId });
    // 删除home
    await deleteHomeByBlogIdWithBlogState({ db: req.db!, blogId });
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
    const { oldProps, newProps } = req.body;
    // 删除了type
    if (oldProps.typeId) {
      // 获取type
      const type = await getTypeByTypeId({ db: req.db!, typeId: oldProps.typeId });
      // 减少type
      await updateTypeCountByTypeId({ db: req.db!, typeId: oldProps.typeId, count: type.typeCount - 1 });
    }
    // 增加了type
    if (newProps.typeId) {
      // 获取type
      const type = await getTypeByTypeId({ db: req.db!, typeId: newProps.typeId });
      // 增加type
      await updateTypeCountByTypeId({ db: req.db!, typeId: newProps.typeId, count: type.typeCount + 1 });
    }
    // 删除了tag
    if (oldProps.tagId) {
      const tagIdArr = oldProps.tagId.split(",");
      for (let id of tagIdArr) {
        const tag = await getTagByTagId({ db: req.db!, tagId: id });
        await updateTagCountByTagId({ db: req.db!, tagId: id, count: tag.tagCount - 1 });
      }
    }
    // 增加了tag
    if (newProps.tagId) {
      const tagIdArr = newProps.tagId.split(",");
      for (let id of tagIdArr) {
        const tag = await getTagByTagId({ db: req.db!, tagId: id });
        await updateTagCountByTagId({ db: req.db!, tagId: id, count: tag.tagCount + 1 });
      }
    }
    // 进行更新
    const { blogId, ...resProps } = newProps;
    await updateTableWithParam({ db: req.db!, table: "blogs", param: { set: { ...resProps }, where: { blogId: { value: blogId } } } });
    success({ res, resDate: { state: "更新博客成功", data: `更新blog成功, id: ${blogId}` } });
  },
  errorHandler: ({ res, e, code = 500 }) =>
    fail({ res, statuCode: code, resDate: { state: "更新博客失败", data: e.toString(), methodName: "updateBlogByBlogIdAction" } }),
  userConfig: { needCheck: true, checkStrict: true },
});

export { updateBlogByBlogIdAction, getBlogByBlogIdAction, publishBlogAction, deleteBlogByBlogIdAAction };
