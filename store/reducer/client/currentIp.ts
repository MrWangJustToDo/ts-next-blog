import { produce } from "immer";
import { Reducer } from "redux";
import { clientAction } from "./action";
import { actionName } from "config/action";
import { IpaddressProps } from "types/hook";
import { State, StateAction, StateActionMapType } from "types/store";

type CurrentState = State<IpaddressProps>;

const initState: CurrentState = { data: {}, error: null, loading: true, loaded: false };

const reducer: Reducer<CurrentState> = (state: CurrentState = initState, action: StateAction<IpaddressProps>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: StateActionMapType<IpaddressProps> = {
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

export default reducer;
