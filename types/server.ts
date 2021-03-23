import { Database } from "sqlite";
import { NextFunction, Request, Response } from "express";

type ExpressRequest = Request & { db?: Database; session?: any; user?: any; config?: { cache?: CacheConfigProps; user?: UserConfigProps } };

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
interface ApiResponseProps<T> {
  res: Response;
  statuCode?: number;
  resDate: ApiResponseData<T>;
}
interface ApiResponseType<T> {
  (props: ApiResponseProps<T>): void;
}
interface RequestHandlerProps {
  req: ExpressRequest;
  res: Response;
  next: NextFunction;
}
interface RequestHandlerType {
  (props: RequestHandlerProps): Promise<any> | void;
}
type ErrorHandlerProps = RequestHandlerProps & {
  e: Error;
  code?: number;
};
interface ErrorHandlerType {
  (props: ErrorHandlerProps): Promise<void> | void;
}
interface CacheConfigProps {
  cacheTime?: number;
  needCache?: boolean;
  needDelete?: string | string[] | boolean;
}
interface UserConfigProps {
  needCheck?: boolean;
  checkStrict?: boolean;
}
interface AutoRequestHandlerProps {
  requestHandler: RequestHandlerType;
  errorHandler: ErrorHandlerType;
  strict?: boolean;
  time?: number;
  cacheConfig?: CacheConfigProps;
  userConfig?: UserConfigProps;
}

export type {
  ApiResponseData,
  ApiResponseProps,
  ApiResponseType,
  RequestHandlerProps,
  RequestHandlerType,
  ErrorHandlerType,
  CacheConfigProps,
  UserConfigProps,
  AutoRequestHandlerProps,
};

/* === Init === */
interface TransformHandlerType {
  (req: ExpressRequest, res: Response, next: NextFunction): void;
}

export type { TransformHandlerType };
