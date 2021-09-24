import { State } from "store";
import { useCallback, useMemo, useReducer, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const { data, stateSide = "server", stateName, pageLength = 4 } = props;
  if (!data && !stateName) {
    throw new Error("useBasePage need Data");
  }
  let selector;
  if (stateName) {
    selector = (state: State) => <Array<T>>state[stateSide][stateName]["data"];
  }
  const { state } = useCurrentState<Array<T>>(selector);
  const [currentPage, setCurrentPage] = useState(1);
  const allData = stateName ? (state as Array<T>) : data;
  const allPage = useMemo(() => Math.ceil(allData!.length / pageLength), []);
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

export { useCurrentState, useBasePage, useUpdate };
