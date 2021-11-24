import { ReducerStateAction } from "store/reducer/type";
import { ClientReducerKey } from "../type";

interface ClientActionType {
  SET_DATA_LOADING: (name: ClientReducerKey) => string;
  SET_DATA_ACTION: (name: ClientReducerKey) => string;
  SET_DATA_SUCCESS: (name: ClientReducerKey) => string;
  SET_DATA_FAIL: (name: ClientReducerKey) => string;
}
interface CreateClientActionProps<T> {
  name: ClientReducerKey;
  data?: T;
  error?: any;
}
interface CreateClientActionType {
  <T>(props: CreateClientActionProps<T>): ReducerStateAction<T>;
}

export type { ClientActionType, CreateClientActionProps, CreateClientActionType };
