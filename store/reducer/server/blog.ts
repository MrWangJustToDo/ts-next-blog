import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { serverAction } from "./action";
import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";
import { State, StateAction, StateActionMapType } from "types/store";

type BlogContentArray = {
  [blogId: string]: BlogContentProps;
};

type CurrentState = State<BlogContentArray>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const reducer: Reducer<CurrentState> = (state: CurrentState = initState, action: StateAction<BlogContentArray>) => {
  if (action.type === HYDRATE) {
    if (Object.keys(state.data).length) {
      if (Object.keys(action.payload.server[apiName.blog]["data"]).length > Object.keys(state.data).length) {
        return { ...state, ...action.payload.server[apiName.blog] };
      } else {
        return { ...action.payload.server[apiName.blog], ...state };
      }
    } else {
      return { ...action.payload.server[apiName.blog] };
    }
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: StateActionMapType<BlogContentArray> = {
  [serverAction.GETDATALOADING(apiName.blog)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GETDATASUCESS(apiName.blog)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = { ...proxy.data, ...action.data } || {};
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GETDATAFAIL(apiName.blog)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
