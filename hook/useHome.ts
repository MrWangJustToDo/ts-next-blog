import { useCallback } from "react";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { pageContentLength } from "config/hoom";
import { useCurrentState } from "./useBase";
import { setDataSucess_client } from "store/reducer/client/action";
import { UseHomeType, UseCommendType, BlogContentProps } from "types/hook";

let useHome: UseHomeType;

let useCommend: UseCommendType;

useHome = () => {
  const { state, dispatch } = useCurrentState();
  // 首页全部数据
  const blogs = state.server[apiName.home]["data"];
  // 获取所有页数
  const allPage = Math.ceil(blogs.length / pageContentLength);
  // 获取当前页数
  const currentPage = state.client[actionName.currentHomePage]["data"];
  const increasePage = useCallback(() => dispatch(setDataSucess_client({ name: actionName.currentHomePage, data: currentPage + 1 })), [currentPage]);
  const decreasePage = useCallback(() => dispatch(setDataSucess_client({ name: actionName.currentHomePage, data: currentPage - 1 })), [currentPage]);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  const currentPageBlogs = blogs.slice(currentPage - 1 * pageContentLength, currentPage * pageContentLength);
  return { currentPage, allPage, blogs, currentPageBlogs, increaseAble, decreaseAble, increasePage, decreasePage };
};

useCommend = () => {
  const { state } = useCurrentState();
  const blogs = state.server[apiName.home]["data"];
  const commendBlogs = (blogs as BlogContentProps[]).filter(({ blogState }) => Number(blogState) === 3);
  return { commendBlogs };
};

export { useHome, useCommend };
