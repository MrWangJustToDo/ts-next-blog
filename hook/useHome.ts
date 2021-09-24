import { useCallback } from "react";
import { State } from "store";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { pageContentLength } from "config/home";
import { useCurrentState } from "./useBase";
import { setDataSuccess_client } from "store/reducer/client/action";
import { UseHomeType, UseCommendType, BlogContentProps } from "types/hook";

const useHome: UseHomeType = () => {
  const { state, dispatch } = useCurrentState<State>();
  // 首页全部数据
  const blogs = state.server[apiName.home]["data"];
  // 获取所有页数
  const allPage = Math.ceil(blogs.length / pageContentLength);
  // 获取当前页数
  const currentPage = state.client[actionName.currentHomePage]["data"];
  const increasePage = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentHomePage, data: currentPage + 1 })), [currentPage]);
  const decreasePage = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentHomePage, data: currentPage - 1 })), [currentPage]);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  const currentPageBlogs = blogs.slice((currentPage - 1) * pageContentLength, currentPage * pageContentLength);
  if (allPage > 0 && currentPage > allPage) {
    setDataSuccess_client({ name: actionName.currentHomePage, data: allPage });
  }
  return { currentPage, allPage, blogs, currentPageBlogs, increaseAble, decreaseAble, increasePage, decreasePage };
};

const useCommend: UseCommendType = () => {
  const { state: blogs } = useCurrentState<BlogContentProps[]>((state) => state.server[apiName.home]["data"]);
  const commendBlogs = (blogs as BlogContentProps[]).filter(({ blogState }) => Number(blogState) === 3);
  return { commendBlogs };
};

export { useHome, useCommend };
