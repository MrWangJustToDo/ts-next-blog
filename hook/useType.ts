import { useCallback, useEffect } from "react";
import { AnyAction } from "redux";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { pageContentLength } from "config/type&tag";
import { useCurrentState } from "./useBase";
import { setDataSucess_client } from "store/reducer/client/action";
import { TypeProps, UseTypeType } from "types/hook";

let useType: UseTypeType;

let autoChangeType = (type: TypeProps[], currentType: string, changeCurrentType: Function) => {
  useEffect(() => {
    if (currentType === "" && type.length) {
      changeCurrentType(type[0].typeContent);
    }
  }, [currentType, changeCurrentType, type]);
};

let autoChangePage = (allPage: number, currentPage: number, dispatch: (props: AnyAction) => void) => {
  useEffect(() => {
    if (allPage > 0 && currentPage > allPage) {
      dispatch(setDataSucess_client({ name: actionName.currentTypePage, data: allPage }));
    }
  }, [allPage, currentPage]);
};

useType = (blogs) => {
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
  const changeCurrentType = useCallback((nextType) => dispatch(setDataSucess_client({ name: actionName.currentType, data: nextType })), []);
  autoChangeType(type, currentType, changeCurrentType);
  // 根据当前选中的type获取blog
  const currentBlogs = blogs?.filter(({ typeContent }) => typeContent === currentType) || [];
  // 根据符合的blog获取所有的页数
  const allPage = Math.ceil(currentBlogs.length / pageContentLength);
  const increasePage = useCallback(() => dispatch(setDataSucess_client({ name: actionName.currentTypePage, data: currentPage + 1 })), [currentPage]);
  const decreasePage = useCallback(() => dispatch(setDataSucess_client({ name: actionName.currentTypePage, data: currentPage - 1 })), [currentPage]);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  autoChangePage(allPage, currentPage, dispatch);
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

export { useType };
