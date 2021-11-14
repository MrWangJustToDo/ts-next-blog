import { ReducerStateAction } from "store/reducer/type";
import { ClientReducerKey } from "../type";

interface ClientActionType {
  SETDATALOADING: (name: ClientReducerKey) => string;
  SETDATAACTION: (name: ClientReducerKey) => string;
  SETDATASUCESS: (name: ClientReducerKey) => string;
  SETDATAFAIL: (name: ClientReducerKey) => string;
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
