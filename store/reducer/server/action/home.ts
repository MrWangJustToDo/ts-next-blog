import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { apiName } from "config/api";
import { serverAction } from "../share/action";
import type { ClientTagProps, HomeBlogProps, TypeProps, UserProps } from "types";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

export type HomeProps = Array<HomeBlogProps & UserProps & ClientTagProps & TypeProps>;

type CurrentState = ReducerState<HomeProps>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const homeReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<HomeProps>) => {
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

const actionReducerMap: ReducerStateActionMapType<HomeProps> = {
  [serverAction.GET_DATA_LOADING(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.home)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { homeReducer };
