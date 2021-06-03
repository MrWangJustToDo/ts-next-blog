import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { serverAction } from "./action";
import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";
import { State, StateAction, StateActionMapType } from "types/store";

type CurrentState = State<BlogContentProps[]>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: true };

const reducer: Reducer<CurrentState> = (state: CurrentState = initState, action: StateAction<BlogContentProps[]>) => {
  if (action.type === HYDRATE) {
    if (state.data.length === 0) {
      return { ...action.payload.server[apiName.home] };
    } else {
      return { ...state, ...action.payload.server[apiName.home] };
    }
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: StateActionMapType<BlogContentProps[]> = {
  [serverAction.GETDATALOADING(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GETDATASUCESS(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GETDATAFAIL(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
