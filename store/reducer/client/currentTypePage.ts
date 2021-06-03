import { produce } from "immer";
import { Reducer } from "redux";
import { clientAction } from "./action";
import { actionName } from "config/action";
import { State, StateAction, StateActionMapType } from "types/store";

type CurrentState = State<number>;

const initState: CurrentState = { data: 1, error: null, loaded: false, loading: true };

const reducer: Reducer<CurrentState> = (state: CurrentState = initState, action: StateAction<number>) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: StateActionMapType<number> = {
  [clientAction.SETDATALOADING(actionName.currentTypePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = 1;
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentTypePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || 1;
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentTypePage)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = 1;
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
