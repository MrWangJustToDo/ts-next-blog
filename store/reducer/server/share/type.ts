import { ReducerStateAction } from "store/reducer/type";
import { ServerReducerKey } from "../type";

interface ServerActionType {
  GET_DATA_LOADING: (name: ServerReducerKey) => string;
  GET_DATA_ACTION: (name: ServerReducerKey) => string;
  GET_DATA_SUCCESS: (name: ServerReducerKey) => string;
  GET_DATA_FAIL: (name: ServerReducerKey) => string;
}

interface CreateServerActionProps<T> {
  name: ServerReducerKey;
  data?: T;
  error?: any;
}

interface CreateServerActionType {
  <T>(props: CreateServerActionProps<T>): ReducerStateAction<T>;
}

export type { ServerActionType, CreateServerActionProps, CreateServerActionType };
