import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { State } from "store";
import { useDispatch, useSelector } from "react-redux";
import { usePrevious } from "./useOverlay";
import { log } from "utils/log";
import { parseToString } from "utils/data";
import { UseBasePageProps, UseBasePageType, UseCurrentStateType } from "types/hook";

type StateResult<T> = T | State;

const defaultSelector = (state: State) => state;

const useCurrentState: UseCurrentStateType = <T extends any>(selector?: (state: State) => T) => {
  const currentSelector = selector || defaultSelector;
  const dispatch = useDispatch();
  const state = useSelector<State, StateResult<T>>(currentSelector);
  return { state, dispatch };
};

const useBasePage: UseBasePageType = <T>(props: UseBasePageProps<T> = {}) => {
  const { data, selector, pageLength = 4 } = props;
  if (!data && !selector) {
    throw new Error("useBasePage need Data");
  }
  const { state } = useCurrentState<Array<T>>(selector);
  const [currentPage, setCurrentPage] = useState(1);
  const allData = data || (state as Array<T>);
  const allPage = useMemo(() => Math.ceil(allData!.length / pageLength), [allData, pageLength]);
  const increasePage = useCallback(() => setCurrentPage((lastPage) => lastPage + 1), []);
  const decreasePage = useCallback(() => setCurrentPage((lastPage) => lastPage - 1), []);
  const increaseAble = currentPage < allPage;
  const decreaseAble = currentPage > 1;
  const currentPageData = allData?.slice((currentPage - 1) * pageLength, currentPage * pageLength);
  if (allPage > 0 && currentPage > allPage) {
    setCurrentPage(allPage);
  }
  return { allData: allData!, allPage, currentPage, currentPageData: currentPageData!, decreaseAble, increaseAble, decreasePage, increasePage };
};

const useUpdate = () => {
  const [, forceUpdate] = useReducer((a) => a + 1, 0);

  return forceUpdate;
};

const useUpdateProps = (componentName: string, props: { [props: string]: any }) => {
  const prevProps = usePrevious<{ [props: string]: any }>(props);

  useEffect(() => {
    if (prevProps) {
      const allKeys = Object.keys({ ...prevProps, ...props });
      const changedProps: { [props: string]: any } = {};

      allKeys.forEach((key) => {
        if (prevProps[key] !== undefined && prevProps[key] !== props[key]) {
          changedProps[key] = {
            from: prevProps![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        log(`component update -- ${componentName} -- ${parseToString(changedProps)}`, "normal");
      }
    }
  }, [props]);
};

export { useCurrentState, useBasePage, useUpdate, useUpdateProps };
