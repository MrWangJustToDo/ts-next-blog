import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/dist/client/router";
import { actionName } from "config/action";
import { useCurrentState } from "./useBase";
import { setDataSuccess_client } from "store/reducer/client/share/action";

interface UseHeaderItemType {
  (props?: { needInitHead?: boolean }): { currentHeader: string; changeCurrentHeader: (headItem: string) => void };
}

const useHeaderItem: UseHeaderItemType = (props = {}) => {
  const { needInitHead = false } = props;
  const { asPath } = useRouter();
  const { state: currentHeader, dispatch } = useCurrentState((state) => state.client[actionName.currentHeader]["data"]);
  const ref = useRef<string>(currentHeader);
  ref.current = currentHeader;
  const changeCurrentHeader = useCallback<(props: string) => void>(
    (headItem) => {
      if (ref.current !== headItem) {
        dispatch(setDataSuccess_client({ name: actionName.currentHeader, data: headItem }));
      }
    },
    [dispatch]
  );
  useEffect(() => {
    if (needInitHead && asPath !== ref.current) {
      changeCurrentHeader(asPath);
    }
  }, [asPath, changeCurrentHeader, needInitHead]);
  return { currentHeader, changeCurrentHeader };
};

export { useHeaderItem };
