import { ReducerStateAction } from "store/reducer/type";
import { ServerReducerKey } from "../type";

interface ServerActionType {
  GETDATALOADING: (name: ServerReducerKey) => string;
  GETDATAACTION: (name: ServerReducerKey) => string;
  GETDATASUCESS: (name: ServerReducerKey) => string;
  GETDATAFAIL: (name: ServerReducerKey) => string;
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
