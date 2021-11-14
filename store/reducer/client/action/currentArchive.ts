import { produce } from "immer";
import { Reducer } from "redux";
import { clientAction } from "../share/action";
import { actionName } from "config/action";
import { HYDRATE } from "next-redux-wrapper";
import type { HomeProps } from "store/reducer/server/action/home";
import type { ReducerState, ReducerStateAction, ReducerStateActionMapType } from "store/reducer/type";

type ArchiveProps = Record<string, HomeProps>;

type CurrentState = ReducerState<ArchiveProps>;

const initState: CurrentState = { data: {}, error: null, loaded: false, loading: false };

const archiveReducer: Reducer<CurrentState> = (state: CurrentState = initState, action: ReducerStateAction<ArchiveProps>) => {
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

const actionReducerMap: ReducerStateActionMapType<ArchiveProps> = {
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

export { archiveReducer };
