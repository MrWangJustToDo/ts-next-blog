import { IncomingHttpHeaders } from "http";
import { AxiosRequestConfig, Method } from "axios";
import { Cache } from "utils/cache";
import { apiName } from "config/api";

/* delay */
interface Cancel {
  (key: string): void;
}
interface Delay {
  <T>(time: number, action?: () => T, key?: string): Promise<T | void>;
}
interface TimeoutMap {
  [props: string]: Array<NodeJS.Timeout | void>;
}
interface RejectMap {
  [props: string]: Array<(() => void) | void>;
}
interface KeyMap {
  [props: string]: number;
}

export type { Cancel, Delay, TimeoutMap, RejectMap, KeyMap };

/* action */
interface JudgeActionProps<T> {
  element: T;
  judge: () => Promise<{ className: string; message: string; needHandle?: boolean }>;
}

interface JudgeActionType {
  <T extends HTMLElement>(props: JudgeActionProps<T>): void;
}

interface LoadingActionProps<T> {
  element: T;
  loadingClassName: string;
}

interface LoadingActionType {
  <T extends HTMLElement>(props: LoadingActionProps<T>): void;
}

export type { JudgeActionProps, JudgeActionType, LoadingActionProps, LoadingActionType };

/* request */
interface PendingType {
  url?: string;
  method?: Method;
  params: any;
  data: any;
  cancel: Function;
}
interface RemovePendingType {
  (props: AxiosRequestConfig, isRequest?: boolean): void;
}

export type { PendingType, RemovePendingType };

/* path */
interface QueryProps {
  [props: string]: string;
}
interface TransformPathProps {
  path?: string;
  apiPath?: apiName;
  query?: QueryProps;
  needPre?: boolean;
}
interface TransformPathType {
  (props: TransformPathProps): string;
}

export type { QueryProps, TransformPathType };

/* header */
interface HeaderProps {
  [props: string]: string | boolean;
}
interface GetHeaderType {
  (props?: HeaderProps): HeaderProps;
}

export type { HeaderProps, GetHeaderType };

/* fetcher */
interface AutoRequestProps {
  method?: Method;
  path?: string;
  apiPath?: apiName;
  query?: QueryProps | string | false;
  header?: IncomingHttpHeaders | HeaderProps | string | false;
  data?: string | false | { [props: string]: any };
  cache?: boolean;
  cacheTime?: number;
  encode?: boolean;
}
interface ApiRequestResult<T> {
  code: number;
  data: T | T[];
  state: string;
  res: any;
}
interface CreateRequestType {
  (props?: AutoRequestProps): AutoRequestType;
}
interface AutoRequestType {
  (props?: AutoRequestProps): AutoRequestType;
  run: <T>() => Promise<T>;
  advance: (transform: (props: AutoRequestProps) => AutoRequestProps | void) => AutoRequestType;
  cache: Cache<string, any>;
  cacheKey: string;
  deleteCache: () => AutoRequestType;
}

export type { AutoRequestProps, ApiRequestResult, CreateRequestType, AutoRequestType };

/* dom */
type Arguments = string | string[] | (() => string)[] | (() => string) | (() => string[]);

interface TransformArray {
  (args: Arguments[]): string[];
}
interface GetClass {
  (...args: Arguments[]): string;
}
interface GetArray<T> {
  (): T[];
}
interface GetItem<T> {
  (): T;
}
interface AnimateCSSProps {
  element: HTMLElement;
  prefix?: string;
  from: string;
  to: string;
  faster?: boolean;
}
interface AnimateCSSType {
  (props: AnimateCSSProps): Promise<void>;
}
interface HandleCssActionProps {
  element: HTMLElement;
  classNames: string[];
  type: "add" | "remove";
}
interface HandleClassActionType {
  (props: HandleCssActionProps): void;
}

export type { TransformArray, GetClass, GetArray, GetItem, AnimateCSSType, HandleClassActionType };

/* data */
type ResultProps<T, F> = ApiRequestResult<T> & F;
interface AutoTransformDataType {
  <T, F extends { [props: string]: string }>(data: ResultProps<T, F>): T | T[] | F;
}
interface GetCurrentAvatar {
  (avatar?: string, gender?: number): string;
}
interface FormChild extends Element {
  name?: string;
  type?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
}
interface FormSerializeType {
  (element: HTMLFormElement): { [props: string]: null | string | string[] };
}

export type { ResultProps, AutoTransformDataType, GetCurrentAvatar, FormChild, FormSerializeType };

/* moment */
interface TimeToString {
  (props: Date | string): string;
}

export type { TimeToString };

/* image */
interface LoadImgProps {
  imgUrl: apiName;
  strUrl: apiName;
  imgElement: HTMLImageElement;
  state?: boolean;
}
interface LoadImgType {
  (props: LoadImgProps): Promise<HTMLImageElement | void>;
}

export type { LoadImgType };

/* markdown */
interface AddIdForHeadsType {
  (className: string): void | boolean;
}

export type { AddIdForHeadsType };
