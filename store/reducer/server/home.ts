import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { serverAction } from "./action";
import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";
import { State, StateAction, StateActionMapType } from "types/store";

type CurrentState = State<BlogContentProps[]>;

let initState: CurrentState;
let reducer: Reducer<CurrentState>;
let actionReducerMap: StateActionMapType<BlogContentProps[]>;

initState = { data: [], error: null, loaded: false, loading: true };

reducer = (state: CurrentState = initState, action: StateAction<BlogContentProps[]>) => {
  if (action.type === HYDRATE) {
    if (state.data.length === 0) {
      return { ...action.payload.server[apiName.home] };
    } else {
      if (state.data.length < action.payload.server[apiName.home]["data"].length) {
        return { ...state, ...action.payload.server[apiName.home] };
      } else {
        return { ...action.payload.server[apiName.home], ...state };
      }
    }
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

actionReducerMap = {
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
