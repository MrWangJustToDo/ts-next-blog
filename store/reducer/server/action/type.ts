import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { apiName } from "config/api";
import { serverAction } from "../share/action";
import { TypeProps } from "types";
import { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type CurrentState = ReducerState<TypeProps[]>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const typeReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<TypeProps[]>) => {
  if (action.type === HYDRATE) {
    if (state.data.length) {
      if (state.data.length < action.payload.server[apiName.type]["data"].length) {
        return { ...state, ...action.payload.server[apiName.type] };
      } else {
        return { ...action.payload.server[apiName.type], ...state };
      }
    } else {
      return { ...action.payload.server[apiName.type] };
    }
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

const actionReducerMap: ReducerStateActionMapType<TypeProps[]> = {
  [serverAction.GET_DATA_LOADING(apiName.type)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.type)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.type)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { typeReducer };
