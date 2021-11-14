import { produce } from "immer";
import { Reducer } from "redux";
import { actionName } from "config/action";
import { clientAction } from "../share/action";
import type { HomeProps } from "store/reducer/server/action/home";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type CurrentState = ReducerState<HomeProps>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const resultReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<HomeProps>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<HomeProps> = {
  [clientAction.SETDATALOADING(actionName.currentResult)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentResult)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentResult)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { resultReducer };
