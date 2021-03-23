import { produce, Draft } from "immer";
import { AnyAction, Reducer } from "redux";
import { clientAction } from "./action";
import { actionName } from "config/action";
import { State, ActionMapType } from "./@type";
import { BlogContentProps } from "hook/@type";

type CurrentState = State<BlogContentProps[]>;

let initState: CurrentState;
let reducer: Reducer<CurrentState>;
let actionReducerMap: ActionMapType<CurrentState>;

initState = { data: [] };

reducer = (state: CurrentState = initState, action: AnyAction) => {
  let actionReducer = actionReducerMap[action.type];
  if (actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
};

actionReducerMap = {
  [clientAction.SETDATASUCESS(actionName.currentResult)]: (state: CurrentState, action: AnyAction) =>
    produce(state, (proxy: Draft<CurrentState>) => {
      proxy.data = action.data;
    }),
  [clientAction.SETDATAFAIL(actionName.currentResult)]: (state: CurrentState, action: AnyAction) =>
    produce(state, (proxy: Draft<CurrentState>) => {
      proxy.data = action.e;
    }),
};

export default reducer;
