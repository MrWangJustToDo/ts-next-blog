import { produce } from "immer";
import { Reducer } from "redux";
import { clientAction } from "./action";
import { actionName } from "config/action";
import { HYDRATE } from "next-redux-wrapper";
import { BlogContentProps } from "types/hook";
import { State, StateAction, StateActionMapType } from "types/store";

type ArchiveProps = {
  [year: string]: BlogContentProps[];
};

type CurrentState = State<ArchiveProps>;

let initState: CurrentState;
let reducer: Reducer<CurrentState>;
let actionReducerMap: StateActionMapType<ArchiveProps>;

initState = { data: {}, error: null, loaded: false, loading: true };

reducer = (state: CurrentState = initState, action: StateAction<ArchiveProps>) => {
  // 合并服务器上的client部分数据
  if (action.type === HYDRATE) {
    return { ...action.payload.client[actionName.currentArchive] };
  }
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

actionReducerMap = {
  [clientAction.SETDATALOADING(actionName.currentArchive)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = null;
      proxy.loading = action.loadingState || true;
      proxy.loaded = false;
    }),
  [clientAction.SETDATASUCESS(actionName.currentArchive)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = action.data || {};
      proxy.error = null;
      proxy.loading = false;
      proxy.loaded = true;
    }),
  [clientAction.SETDATAFAIL(actionName.currentArchive)]: (state, action) =>
    produce(state, (proxy) => {
      proxy.data = {};
      proxy.error = action.error;
      proxy.loading = false;
      proxy.loaded = true;
    }),
};

export default reducer;
