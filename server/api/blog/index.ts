import { apiName } from "config/api";
import { getBlogByBlogIdAction, deleteBlogByBlogIdAAction, publishBlogAction, updateBlogByBlogIdAction, updateBlogReadAction } from "./blog";

const blogHandler = {
  [apiName.blog]: getBlogByBlogIdAction,
  [apiName.publishBlog]: publishBlogAction,
  [apiName.updateBlog]: updateBlogByBlogIdAction,
  [apiName.deleteBlog]: deleteBlogByBlogIdAAction,
  [apiName.addBlogRead]: updateBlogReadAction,
};

export { blogHandler };
