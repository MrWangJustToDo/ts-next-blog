import { useCallback, useMemo, useState } from "react";
import { State } from "store";
import throttle from "lodash/throttle";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { archiveLength } from "config/archive";
import { useCurrentState } from "./useBase";
import { useAutoActionHandler } from "./useAuto";
import { ArchiveProps, UseArchiveType, UseAutoLoadArchiveType } from "types/hook";

const autoLoadArchive = (loadArchive: Function, archiveData: Object, needUpdate: boolean, setNeedUpdate: Function) => {
  if (Object.keys(archiveData).length && needUpdate) {
    loadArchive({ ...archiveData });
    setNeedUpdate(false);
  }
};

const useArchive: UseArchiveType = () => {
  const { state } = useCurrentState<State>();
  const [page, setPage] = useState<number>(1);
  const [bool, setBool] = useState<boolean>(true);
  const [value, setValue] = useState<ArchiveProps>({});
  // 获取所有的archive
  const archives = state.client[actionName.currentArchive]["data"];
  // 获取所有的长度
  const allCount = state.server[apiName.home]["data"].length;
  // 获取当前最少显示的archive数量
  const currentCount = page * archiveLength;
  const currentArchive: ArchiveProps = {};
  let count = 0;
  for (let key in archives) {
    count += archives[key].length;
    currentArchive[key] = archives[key];
    if (count >= currentCount) {
      break;
    }
  }
  autoLoadArchive(setValue, currentArchive, bool, setBool);
  const loadMore = useCallback(() => (setPage((last) => last + 1), setBool(true)), []);
  const canLoad = useMemo(() => allCount > currentCount, [allCount, currentCount]);
  return { value, allCount, canLoad, loadMore };
};

const useAutoLoadArchive: UseAutoLoadArchiveType = ({ canLoad, loadMore, breakPoint }) => {
  const loadMoreCallback = useCallback<() => void>(
    throttle(() => {
      if (document.body.offsetHeight - (document.scrollingElement?.scrollTop || 0) < breakPoint) {
        loadMore();
      }
    }, 1000),
    [breakPoint]
  );
  useAutoActionHandler({
    rightNow: true,
    actionState: canLoad,
    action: loadMoreCallback,
    addListenerCallback: (action) => window.addEventListener("scroll", action),
    removeListenerCallback: (action) => window.removeEventListener("scroll", action),
  });
};

export { useArchive, useAutoLoadArchive };
