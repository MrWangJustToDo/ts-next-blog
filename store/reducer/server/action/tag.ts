import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { apiName } from "config/api";
import { serverAction } from "../share/action";
import type { ServerTagProps } from "types";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type CurrentState = ReducerState<ServerTagProps[]>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const tagReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<ServerTagProps[]>) => {
  if (action.type === HYDRATE) {
    if (state.data.length) {
      if (state.data.length < action.payload.server[apiName.tag]["data"].length) {
        return { ...state, ...action.payload.server[apiName.tag] };
      }
      return { ...action.payload.server[apiName.tag], ...state };
    } else {
      return { ...action.payload.server[apiName.tag] };
    }
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<ServerTagProps[]> = {
  [serverAction.GET_DATA_LOADING(apiName.tag)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.tag)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.tag)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { tagReducer };
