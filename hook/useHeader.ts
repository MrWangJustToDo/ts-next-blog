import { useCallback, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { actionName } from "config/action";
import { useCurrentState } from "./useBase";
import { setDataSucess_client } from "store/reducer/client/action";
import { UseHeaderItemType } from "types/hook";

let useHeaderItem: UseHeaderItemType;

let autoChangeHeader = (item: string, currentHeader: string, changeCurrentItem: Function, needChange: boolean) => {
  useEffect(() => {
    if (needChange && item !== currentHeader) {
      changeCurrentItem(item);
    }
  }, [item, changeCurrentItem, currentHeader, needChange]);
};

useHeaderItem = (props = {}) => {
  const { needInitHead = false } = props;
  const { route } = useRouter();
  const { state, dispatch } = useCurrentState();
  const currentHeader = state.client[actionName.currentHeader]["data"];
  const changeCurrentHeader = useCallback<(props: string) => void>(
    (headItem) => dispatch(setDataSucess_client({ name: actionName.currentHeader, data: headItem })),
    []
  );
  autoChangeHeader(route, currentHeader, changeCurrentHeader, needInitHead);
  return { currentHeader, changeCurrentHeader };
};

export { useHeaderItem };
