import { State } from "store";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UseBasePageProps, UseBasePageType, UseCurrentStateType } from "types/hook";

const useCurrentState: UseCurrentStateType = () => {
  const dispatch = useDispatch();
  const state = useSelector<State, State>((state) => state);
  return { state, dispatch };
};

const useBasePage: UseBasePageType = <T>(props: UseBasePageProps<T> = {}) => {
  const { data, stateSide = "server", stateName, pageLength = 4 } = props;
  if (!data && !stateName) {
    throw new Error("useBasePage need Data");
  }
  const { state } = useCurrentState();
  const [currentPage, setCurrentPage] = useState(1);
  let allData;
  if (stateName) {
    allData = <Array<T>>state[stateSide][stateName]["data"];
  } else {
    allData = data;
  }
  const allPage = Math.ceil(allData!.length / pageLength);
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

export { useCurrentState, useBasePage };
