import { useCallback, useEffect } from "react";
import { AnyAction } from "redux";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { pageContentLength } from "config/type&tag";
import { useCurrentState } from "./useBase";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import type { TypeProps } from "types";
import type { HomeProps } from "store/reducer/server/action/home";

const useAutoChangeType = (type: TypeProps[], currentType: string, changeCurrentType: Function, needChange: boolean) => {
  useEffect(() => {
    if (needChange && currentType === "" && type.length) {
      changeCurrentType(type[0].typeContent);
    }
  }, [needChange, currentType, changeCurrentType, type]);
};

const useAutoChangePage = (allPage: number, currentPage: number, dispatch: (props: AnyAction) => void) => {
  useEffect(() => {
    if (allPage > 0 && currentPage > allPage) {
      dispatch(setDataSuccess_client({ name: actionName.currentTypePage, data: allPage }));
    }
  }, [allPage, currentPage, dispatch]);
};

export const useType = (props: { blogs?: HomeProps; needInitType?: boolean } = {}) => {
  let { blogs, needInitType = false } = props;
  const { state, dispatch } = useCurrentState();
  // 所有type
  const type = state.server[apiName.type]["data"];
  // 获取当前的blog
  blogs = blogs || state.server[apiName.home]["data"];
  // 当前选中的type
  const currentType = state.client[actionName.currentType]["data"];
  // 当前页数
  const currentPage = state.client[actionName.currentTypePage]["data"];
  // 更改当前选中的type
  const changeCurrentType = useCallback((nextType: string) => dispatch(setDataSuccess_client({ name: actionName.currentType, data: nextType })), [dispatch]);
  // 自动设置初始type
  useAutoChangeType(type, currentType, changeCurrentType, needInitType);
  // 根据当前选中的type获取blog
  const currentBlogs = blogs?.filter(({ typeContent }) => typeContent === currentType) || [];
  // 根据符合的blog获取所有的页数
  const allPage = Math.ceil(currentBlogs.length / pageContentLength);
  const increasePage = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentTypePage, data: currentPage + 1 })), [currentPage, dispatch]);
  const decreasePage = useCallback(() => dispatch(setDataSuccess_client({ name: actionName.currentTypePage, data: currentPage - 1 })), [currentPage, dispatch]);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  useAutoChangePage(allPage, currentPage, dispatch);
  const currentPageBlogs = currentBlogs.slice((currentPage - 1) * pageContentLength, currentPage * pageContentLength);
  return {
    type,
    currentType,
    changeCurrentType,
    allPage,
    currentPage,
    currentPageBlogs,
    increasePage,
    decreasePage,
    increaseAble,
    decreaseAble,
  };
};
