import { useCallback, useMemo, useState } from "react";
import throttle from "lodash/throttle";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { archiveLength } from "config/archive";
import { useCurrentState } from "./useBase";
import { useAutoActionHandler } from "./useAuto";
import { ArchiveProps, UseArchiveType, UseAutoLoadArchiveType } from "types/hook";

let useArchive: UseArchiveType;

let useAutoLoadArchive: UseAutoLoadArchiveType;

let autoLoadArchive = (loadArchive: Function, archiveData: Object, needUpdate: boolean, setNeedUpdate: Function) => {
  if (Object.keys(archiveData).length && needUpdate) {
    loadArchive({ ...archiveData });
    setNeedUpdate(false);
  }
};

useArchive = () => {
  const { state } = useCurrentState();
  const [page, setPage] = useState<number>(1);
  const [bool, setBool] = useState<boolean>(true);
  const [value, setValue] = useState<ArchiveProps | null>(null);
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

useAutoLoadArchive = ({ canLoad, loadMore, breakPoint }) => {
  const loadMoreCallback = useCallback<() => void>(
    throttle(() => {
      if (document.body.offsetHeight - (document.scrollingElement?.scrollTop || 0) < breakPoint) {
        loadMore();
      }
    }, 1000),
    []
  );
  const addListenerCallback = useCallback<(action: () => void) => void>((action) => window.addEventListener("scroll", action), []);
  const removeListenerCallback = useCallback<(action: () => void) => void>((action) => window.removeEventListener("scroll", action), []);
  useAutoActionHandler({
    action: loadMoreCallback,
    actionState: canLoad,
    rightNow: true,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
  });
};

export { useArchive, useAutoLoadArchive };
