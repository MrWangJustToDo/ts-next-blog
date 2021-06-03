import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { clientAction } from "./action";
import { actionName } from "config/action";
import { State, StateAction, StateActionMapType } from "types/store";

type CurrentState = State<string[]>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: true };

const reducer: Reducer<CurrentState> = (state: CurrentState = initState, action: StateAction<string[]>) => {
  if (action.type === HYDRATE) {
    // 同步服务器上的currentId数据
    return { ...action.payload.client[actionName.currentAssent] };
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: StateActionMapType<string[]> = {
  [clientAction.SETDATALOADING(actionName.currentAssent)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentAssent)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data.push(...action.data!);
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentAssent)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};
export default reducer;
