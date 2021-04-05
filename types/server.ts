import { Database } from "sqlite";
import { NextFunction, Request, Response } from "express";

type ExpressRequest = Request & {
  db?: Database;
  session?: any;
  user?: any;
  config?: { cache?: CacheConfigProps; user?: UserConfigProps; check?: CheckCodeConfigProps; params?: CheckParamsConfigProps };
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
  cacheKey?: string | (({ req }: { req: ExpressRequest }) => string);
  cacheTime?: number;
  needCache?: boolean;
  needDelete?: string | Array<string | (({ req }: { req: ExpressRequest }) => string)> | boolean | (({ req }: { req: ExpressRequest }) => string);
}
interface CheckCodeConfigProps {
  needCheck?: boolean;
  fieldName?: string;
  fromQuery?: boolean;
}
interface CheckParamsConfigProps {
  fromQuery?: string[];
  fromBody?: string[];
}
interface UserConfigProps {
  needCheck?: boolean;
  checkStrict?: boolean;
}
interface AutoRequestHandlerProps {
  requestHandler: RequestHandlerType;
  errorHandler?: ErrorHandlerType;
  check?: boolean;
  strict?: boolean;
  time?: number;
  checkCodeConfig?: CheckCodeConfigProps;
  cacheConfig?: CacheConfigProps;
  userConfig?: UserConfigProps;
  paramsConfig?: CheckParamsConfigProps;
}

export type {
  ExpressRequest,
  ApiResponseData,
  ApiResponseProps,
  ApiResponseType,
  RequestHandlerProps,
  RequestHandlerType,
  ErrorHandlerType,
  CacheConfigProps,
  CheckCodeConfigProps,
  CheckParamsConfigProps,
  UserConfigProps,
  AutoRequestHandlerProps,
};

/* === Init === */
interface TransformHandlerType {
  (req: ExpressRequest, res: Response, next: NextFunction): void;
}

export type { TransformHandlerType };
