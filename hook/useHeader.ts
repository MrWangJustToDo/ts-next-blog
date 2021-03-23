import { useCallback, useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { actionName } from "config/action";
import { useCurrentState } from "./useBase";
import { setDataSucess_client } from "store/reducer/client/action";
import { UseHeaderItemType } from "types/hook";

let useHeaderItem: UseHeaderItemType;

let autoChangeHeader = (item: string, changeCurrentItem: Function) => {
  useEffect(() => {
    changeCurrentItem(item);
  }, [item, changeCurrentItem]);
};

useHeaderItem = () => {
  const { route } = useRouter();
  const { state, dispatch } = useCurrentState();
  const currentHeader = state.client[actionName.currentHeader]["data"];
  const changeCurrentHeader = useCallback<(props: string) => void>(
    (headItem) => dispatch(setDataSucess_client({ name: actionName.currentHeader, data: headItem })),
    []
  );
  autoChangeHeader(route, changeCurrentHeader);
  return { currentHeader, changeCurrentHeader };
};

export { useHeaderItem };
