import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";
import { clientAction } from "../share/action";

type CurrentState = ReducerState<string>;

const initState: CurrentState = { data: "", error: null, loaded: false, loading: false };

const typeReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<string>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<string> = {
  [clientAction.SET_DATA_LOADING(actionName.currentType)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentType)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || "";
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentType)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = "";
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { typeReducer };
