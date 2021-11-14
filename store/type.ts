import { Store } from "redux";
import { Task } from "redux-saga";
import type { ClientReducer, ClientReducerKey } from "./reducer/client/type";
import type { ServerReducer, ServerReducerKey } from "./reducer/server/type";

export interface StoreState {
  server: { [T in ServerReducerKey]: ServerReducer[T] };
  client: { [T in ClientReducerKey]: ClientReducer[T] };
}

export interface SagaStore extends Store<StoreState> {
  sagaTask?: Task;
}
