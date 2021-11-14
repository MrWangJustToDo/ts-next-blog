import type { AnyAction } from "redux";

interface ReducerState<T> {
  readonly data: T;
  readonly error: any;
  readonly loading: boolean;
  readonly loaded: boolean;
}
interface ReducerStateAction<T> extends AnyAction {
  data?: T;
  error?: Error;
  loadingState?: boolean;
}
interface ReducerStateActionMapType<T> {
  [props: string]: (state: ReducerState<T>, action: ReducerStateAction<T>) => ReducerState<T>;
}

export type { ReducerState, ReducerStateAction, ReducerStateActionMapType };
