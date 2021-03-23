// 定义类型的文件
import { AnyAction } from "redux";
import { actionName } from "config/action";
import { apiName } from "config/api";

/* reducer */
interface State<T> {
  readonly data: T;
  readonly error: any;
  readonly loading: boolean;
  readonly loaded: boolean;
}
interface StateAction<T> extends AnyAction {
  data?: T;
  error?: Error;
  loadingState?: boolean;
}
interface StateActionMapType<T> {
  [props: string]: (state: State<T>, action: StateAction<T>) => State<T>;
}

export type { State, StateAction, StateActionMapType };

/* --- client --- */

/* action */
interface ClientActionType {
  SETDATALOADING: (name: actionName) => string;
  SETDATAACTION: (name: actionName) => string;
  SETDATASUCESS: (name: actionName) => string;
  SETDATAFAIL: (name: actionName) => string;
}
interface CreateClientActionProps<T> {
  name: actionName;
  data?: T;
  error?: any;
}
interface CreateClientActionType {
  <T>(props: CreateClientActionProps<T>): StateAction<T>;
}

export type { ClientActionType, CreateClientActionProps, CreateClientActionType };

/* --- server --- */

/* action */
interface ServerActionType {
  GETDATALOADING: (name: apiName) => string;
  GETDATAACTION: (name: apiName) => string;
  GETDATASUCESS: (name: apiName) => string;
  GETDATAFAIL: (name: apiName) => string;
}
interface CreateServerActionProps<T> {
  name: apiName;
  data?: T;
  error?: any;
}
interface CreateServerActionType {
  <T>(props: CreateServerActionProps<T>): StateAction<T>;
}

export type { ServerActionType, CreateServerActionProps, CreateServerActionType };
