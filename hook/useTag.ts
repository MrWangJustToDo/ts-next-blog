import { useCallback, useEffect } from "react";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { pageContentLength } from "config/type&tag";
import { useCurrentState } from "./useBase";
import { setDataSucess_client } from "store/reducer/client/action";
import { UseTagType } from "types/hook";
import { TagProps } from "types/containers";

let useTag: UseTagType;

let autoChangeTag = (tag: TagProps[], currentTag: string, changeCurrentTag: Function) => {
  useEffect(() => {
    if (currentTag === "" && tag.length) {
      changeCurrentTag(tag[0].tagContent);
    }
  }, [currentTag, changeCurrentTag, tag]);
};

useTag = (blogs) => {
  const { state, dispatch } = useCurrentState();
  // 当前所有的tag
  const tag = state.server[apiName.tag]["data"];
  // 获取所有的blog
  blogs = blogs || state.server[apiName.home]["data"];
  // 当前选中的tag
  const currentTag = state.client[actionName.currentTag]["data"];
  // 当前tag的页数
  const currentPage = state.client[actionName.currentTagPage]["data"];
  // 更改当前选中的tag
  const changeCurrentTag = useCallback((nextTag) => dispatch(setDataSucess_client({ name: actionName.currentTag, data: nextTag })), []);
  // 自动设置初始选中tag
  autoChangeTag(tag, currentTag, changeCurrentTag);
  // 根据当前选中的tag获取blog
  const currentBlogs = blogs?.filter(({ tagContent }) => tagContent?.includes(currentTag)) || [];
  // 获取符合当前tag的blog页数
  const allPage = Math.ceil(currentBlogs.length / pageContentLength);
  const increasePage = useCallback(() => dispatch(setDataSucess_client({ name: actionName.currentTagPage, data: currentPage + 1 })), [currentPage]);
  const decreasePage = useCallback(() => dispatch(setDataSucess_client({ name: actionName.currentTagPage, data: currentPage - 1 })), [currentPage]);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  const currentPageBlogs = currentBlogs.slice(currentPage - 1 * pageContentLength, currentPage * pageContentLength);
  return {
    tag,
    currentTag,
    changeCurrentTag,
    allPage,
    currentPage,
    currentPageBlogs,
    increaseAble,
    decreaseAble,
    increasePage,
    decreasePage,
  };
};

export { useTag };
