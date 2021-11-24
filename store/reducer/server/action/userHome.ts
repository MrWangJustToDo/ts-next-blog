import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { apiName } from "config/api";
import { serverAction } from "../share/action";
import type { HomeProps } from "./home";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type CurrentState = ReducerState<HomeProps>;

const initState: CurrentState = { data: [], error: null, loaded: false, loading: false };

const userHomeReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<HomeProps>) => {
  if (action.type === HYDRATE) {
    if (state.data.length === 0) {
      return { ...action.payload.server[apiName.userHome] };
    } else {
      return { ...state, ...action.payload.server[apiName.userHome] };
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
  [serverAction.GET_DATA_LOADING(apiName.userHome)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GET_DATA_SUCCESS(apiName.userHome)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GET_DATA_FAIL(apiName.userHome)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export { userHomeReducer };
