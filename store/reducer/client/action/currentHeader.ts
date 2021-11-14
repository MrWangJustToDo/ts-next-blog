import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { clientAction } from "../share/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type CurrentState = ReducerState<string>;

const initState: CurrentState = { data: "/", error: null, loaded: false, loading: false };

const headerReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<string>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<string> = {
  [clientAction.SETDATALOADING(actionName.currentHeader)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentHeader)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || "";
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentHeader)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { headerReducer };
