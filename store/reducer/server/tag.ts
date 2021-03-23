import { produce } from "immer";
import { Reducer } from "redux";
import { HYDRATE } from "next-redux-wrapper";
import { serverAction } from "./action";
import { apiName } from "config/api";
import { TagProps } from "types/containers";
import { State, StateAction, StateActionMapType } from "types/store";

type CurrentState = State<TagProps[]>;

let initState: CurrentState;
let reducer: Reducer<CurrentState>;
let actionReducerMap: StateActionMapType<TagProps[]>;

initState = { data: [], error: null, loaded: false, loading: true };

reducer = (state: CurrentState = initState, action: StateAction<TagProps[]>) => {
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

actionReducerMap = {
  [serverAction.GETDATALOADING(apiName.tag)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [serverAction.GETDATASUCESS(apiName.tag)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || [];
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [serverAction.GETDATAFAIL(apiName.tag)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = [];
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
