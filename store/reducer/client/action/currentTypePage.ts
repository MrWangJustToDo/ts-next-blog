import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";
import { clientAction } from "../share/action";

type CurrentState = ReducerState<number>;

const initState: CurrentState = { data: 1, error: null, loaded: false, loading: false };

const typePageReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<number>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<number> = {
  [clientAction.SET_DATA_LOADING(actionName.currentTypePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = 1;
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SET_DATA_SUCCESS(actionName.currentTypePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || 1;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SET_DATA_FAIL(actionName.currentTypePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = 1;
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { typePageReducer };
