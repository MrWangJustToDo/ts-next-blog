import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";
import { clientAction } from "../share/action";
import type { IpAddressProps, UserProps } from "types";

type CurrentState = ReducerState<(UserProps & IpAddressProps) | {}>;

const initState: CurrentState = { data: {}, error: null, loading: false, loaded: false };

const userReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<(UserProps & IpAddressProps) | {}>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<(UserProps & IpAddressProps) | {}> = {
  [clientAction.SET_DATA_LOADING(actionName.currentUser)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentUser)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || {};
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentUser)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { userReducer };
