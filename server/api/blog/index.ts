import { apiName } from "config/api";
import { getBlogByBlogIdAction, deleteBlogByBlogIdAAction, publishBlogAction, updateBlogByBlogIdAction, updateBlogReadAction } from "./blog";

const blogHandler = {
  [apiName.blog]: getBlogByBlogIdAction,
  [apiName.publishBlog]: publishBlogAction,
  [apiName.updataBlog]: updateBlogByBlogIdAction,
  [apiName.deleteBlog]: deleteBlogByBlogIdAAction,
  [apiName.addBlogRead]: updateBlogReadAction,
};

export { blogHandler };
