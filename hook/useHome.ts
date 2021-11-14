import { useCallback } from "react";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { pageContentLength } from "config/home";
import { useCurrentState } from "./useBase";
import { setDataSuccess_client } from "store/reducer/client/share/action";

export const useHome = () => {
  // 首页全部数据
  const { state: blogs, dispatch } = useCurrentState((state) => state.server[apiName.home]["data"]);
  // 获取当前页数
  const { state: currentPage } = useCurrentState((state) => state.client[actionName.currentHomePage]["data"]);
  // 获取所有页数
  const allPage = Math.ceil(blogs.length / pageContentLength);
  const increasePage = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentHomePage, data: currentPage + 1 })), [currentPage, dispatch]);
  const decreasePage = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentHomePage, data: currentPage - 1 })), [currentPage, dispatch]);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  const currentPageBlogs = blogs.slice((currentPage - 1) * pageContentLength, currentPage * pageContentLength);
  if (allPage > 0 && currentPage > allPage) {
    setDataSuccess_client({ name: actionName.currentHomePage, data: allPage });
  }
  return { currentPage, allPage, blogs, currentPageBlogs, increaseAble, decreaseAble, increasePage, decreasePage };
};

export const useCommend = () => {
  const { state: blogs } = useCurrentState((state) => state.server[apiName.home]["data"]);
  const commendBlogs = blogs.filter(({ blogState }) => Number(blogState) === 3);
  return { commendBlogs };
};
