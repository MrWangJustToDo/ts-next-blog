import { useCallback, useMemo, useState } from "react";
import throttle from "lodash/throttle";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { archiveLength } from "config/archive";
import { useCurrentState } from "./useBase";
import { useAutoActionHandler } from "./useAuto";
import type { HomeBlogProps } from "types";
import type { HomeProps } from "store/reducer/server/action/home";

interface ArchiveProps {
  [year: string]: HomeProps;
}
interface UseArchiveType {
  (): { value: ArchiveProps; canLoad: boolean; loadMore: () => void; allCount: number };
}
interface UseAutoLoadArchiveType {
  (props: { canLoad: boolean; loadMore: () => void; breakPoint: number }): void;
}

const autoLoadArchive = (loadArchive: Function, archiveData: Object, needUpdate: boolean, setNeedUpdate: Function) => {
  if (Object.keys(archiveData).length && needUpdate) {
    loadArchive({ ...archiveData });
    setNeedUpdate(false);
  }
};

const useArchive: UseArchiveType = () => {
  const { state: archives } = useCurrentState<ArchiveProps>((state) => state.client[actionName.currentArchive]["data"]);
  const { state: home } = useCurrentState<HomeBlogProps[]>((state) => state.server[apiName.home]["data"]);
  const [page, setPage] = useState<number>(1);
  const [bool, setBool] = useState<boolean>(true);
  const [value, setValue] = useState<ArchiveProps>({});
  // 获取所有的长度
  const allCount = home.length;
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
  useAutoActionHandler({
    rightNow: true,
    actionState: canLoad,
    actionCallback: throttle(() => {
      if (document.body.offsetHeight - (document.scrollingElement?.scrollTop || 0) < breakPoint) {
        loadMore();
      }
    }, 1000),
    addListenerCallback: (action) => window.addEventListener("scroll", action),
    removeListenerCallback: (action) => window.removeEventListener("scroll", action),
    deps: [breakPoint],
  });
};

export { useArchive, useAutoLoadArchive };
