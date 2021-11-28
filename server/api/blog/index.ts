import { apiName } from "config/api";
import {
  getBlogByBlogIdAction,
  deleteBlogByBlogIdAAction,
  publishBlogAction,
  updateBlogByBlogIdAction,
  updateBlogReadAction,
  updateBlogByBlogIdAction_v2,
} from "./blog";

const blogHandler = {
  [apiName.blog]: getBlogByBlogIdAction,
  [apiName.publishBlog]: publishBlogAction,
  [apiName.updateBlog]: updateBlogByBlogIdAction,
  [apiName.deleteBlog]: deleteBlogByBlogIdAAction,
  [apiName.addBlogRead]: updateBlogReadAction,
  [apiName.updateBlog_v2]: updateBlogByBlogIdAction_v2,
};

export { blogHandler };
