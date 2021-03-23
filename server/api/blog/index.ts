import { apiName } from "config/api";
import { getBlogByBlogIdAction, deleteBlogByBlogIdAAction, publishBlogAction, updateBlogByBlogIdAction } from "./blog";

const blogHandler = {
  [apiName.blog]: getBlogByBlogIdAction,
  [apiName.publishBlog]: publishBlogAction,
  [apiName.updataBlog]: updateBlogByBlogIdAction,
  [apiName.deleteBlog]: deleteBlogByBlogIdAAction,
};

export { blogHandler };
