import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/dist/client/router";
import { actionName } from "config/action";
import { useCurrentState } from "./useBase";
import { setDataSuccess_client } from "store/reducer/client/share/action";

interface UseHeaderItemType {
  (props?: { needInitHead?: boolean }): { currentHeader: string; changeCurrentHeader: (headItem: string) => void };
}

const useAutoChangeHeader = (item: string, currentHeader: string, changeCurrentItem: Function, needChange: boolean) => {
  useEffect(() => {
    if (needChange && item !== currentHeader) {
      changeCurrentItem(item);
    }
  }, [item, changeCurrentItem, currentHeader, needChange]);
};

const useHeaderItem: UseHeaderItemType = (props = {}) => {
  const { needInitHead = false } = props;
  const { route } = useRouter();
  const { state: currentHeader, dispatch } = useCurrentState((state) => state.client[actionName.currentHeader]["data"]);
  const ref = useRef<string>(currentHeader);
  ref.current = route;
  const changeCurrentHeader = useCallback<(props: string) => void>((headItem) => {
    if (ref.current !== headItem) {
      dispatch(setDataSuccess_client({ name: actionName.currentHeader, data: headItem }));
    }
  }, [dispatch]);
  useAutoChangeHeader(route, currentHeader, changeCurrentHeader, needInitHead);
  return { currentHeader, changeCurrentHeader };
};

export { useHeaderItem };
