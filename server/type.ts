import type { Database } from "sqlite";
import type { UserProps } from "types";
import type { NextFunction, Request, Response } from "express";
import { Cache } from "utils/cache";
import { ServerError } from "./utils/error";

export type ExpressRequest = Request & {
  db?: Database;
  session?: any;
  user?: UserProps;
  config?: { cache?: CacheConfigProps; user?: UserConfigProps; check?: CheckCodeConfigProps; params?: CheckParamsConfigProps; encode?: boolean };
};

/* === API === */
/* api */
interface ApiResponseData<T> {
  code?: number;
  time?: string;
  state?: string;
  data?: T;
  last?: any[];
  methodName?: string;
}
export interface ApiResponseProps<T> {
  res: Response;
  statusCode?: number;
  resDate: ApiResponseData<T>;
}
export interface ApiResponseType<T> {
  (props: ApiResponseProps<T>): void;
}
export interface CacheConfigProps {
  cacheKey?: string | (({ req }: { req: ExpressRequest }) => string);
  cacheTime?: number;
  needCache?: boolean;
  needDelete?:
    | string
    | Array<string | (({ req }: { req: ExpressRequest }) => string | string[])>
    | boolean
    | (({ req }: { req: ExpressRequest }) => string | string[]);
  needDeleteBeforeRequest?:
    | string
    | Array<string | (({ req }: { req: ExpressRequest }) => string | string[])>
    | boolean
    | (({ req }: { req: ExpressRequest }) => string | string[]);
  needDeleteAfterRequest?:
    | string
    | Array<string | (({ req }: { req: ExpressRequest }) => string | string[])>
    | boolean
    | (({ req, cacheData }: { req: ExpressRequest; cacheData: any }) => string | string[]);
}
export interface CheckCodeConfigProps {
  needCheck?: boolean;
  fieldName?: string;
  fromQuery?: boolean;
}
export interface CheckParamsConfigProps {
  fromQuery?: string[];
  fromBody?: string[];
}
export interface UserConfigProps {
  needCheck?: boolean;
  checkStrict?: boolean;
  checkLogin?: boolean;
}
export interface RequestHandlerProps<T = any> {
  req: ExpressRequest;
  res: Response;
  cache: Cache<string, T>;
}
export interface RequestHandlerType<T = any> {
  (props: RequestHandlerProps<T>): void;
}
export type ErrorHandlerProps = RequestHandlerProps & {
  code?: number;
  ctx: MiddlewareContext;
  e: Error | ServerError;
};
export interface ErrorHandlerType {
  (props: ErrorHandlerProps): void;
}
export interface MiddlewareConfig {
  errorHandler?: ErrorHandlerType;
  requestHandler: RequestHandlerType;
  checkCodeConfig?: CheckCodeConfigProps;
  cacheConfig?: CacheConfigProps;
  userConfig?: UserConfigProps;
  paramsConfig?: CheckParamsConfigProps;
  encodeConfig?: boolean;
  logConfig?: boolean;
  goNext?: boolean;
}
export type MiddlewareContext = MiddlewareConfig & {
  req: ExpressRequest;
  res: Response;
  cache: Cache<string, any>;
  next: NextFunction;
};
export interface WrapperMiddleware {
  (): Promise<void> | void;
}
export interface MiddlewareFunction {
  (ctx: MiddlewareContext, next: WrapperMiddleware): void;
}
