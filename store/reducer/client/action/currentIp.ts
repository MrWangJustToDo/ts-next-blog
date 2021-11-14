import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { clientAction } from "../share/action";
import type { IpAddressProps } from "types";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type CurrentState = ReducerState<IpAddressProps>;

const initState: CurrentState = { data: {}, error: null, loading: false, loaded: false };

const ipReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<IpAddressProps>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<IpAddressProps> = {
  [clientAction.SETDATALOADING(actionName.currentIp)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentIp)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || {};
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentIp)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { ipReducer };
