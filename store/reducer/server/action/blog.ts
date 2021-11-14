import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { serverAction } from "../share/action";
import { apiName } from "config/api";
import type { StoreState } from "store/type";
import type { BlogProps, ClientTagProps, TypeProps, UserProps } from "types";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type BlogContentObject = Record<string, BlogProps & UserProps & TypeProps & ClientTagProps>;

type CurrentState = ReducerState<BlogContentObject>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const blogReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<BlogContentObject>) => {
  if (action.type === HYDRATE) {
    const payLoad = action.payload as StoreState;
    if (Object.keys(state.data).length) {
      if (Object.keys(payLoad.server[apiName.blog]["data"]).length > Object.keys(state.data).length) {
        return { ...state, ...payLoad.server[apiName.blog] };
      } else {
        return { ...payLoad.server[apiName.blog], ...state };
      }
    } else {
      return { ...payLoad.server[apiName.blog] };
    }
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<BlogContentObject> = {
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

export { blogReducer };
