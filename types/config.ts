/* api */
import { SagaStore } from "store";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";
import { Method } from "axios";
import { CacheConfigProps, UserConfigProps } from "./server";

/* api */
interface AccessType {
  [props: string]: { disable?: boolean; token?: boolean; method?: Method; config?: { cache?: CacheConfigProps; user?: UserConfigProps } };
}

export type { AccessType };

/* footer */
interface FootContentProps {
  column?: number;
  head?: string;
  content?: string;
  icon?: string;
  hrefTo?: string;
  title?: string;
  [propo: string]: any;
}

interface FootContentType extends Array<any> {
  [index: number]: FootContentProps;
}

export type { FootContentType };

/* header */
interface HeaderContentItem {
  value: string;
  hrefTo: string;
  icon: string;
}

interface HeaderContentType extends Array<HeaderContentItem> {
  [index: number]: { value: string; hrefTo: string; icon: string };
}

export type { HeaderContentType };

/* hoom */
interface mainContentItem {
  icon?: string;
  content?: string;
  hrefTo?: string;
}

interface MainRightHeader {
  [props: string]: mainContentItem;
}

export type { MainRightHeader };

/* blogItem */
interface BlogContentItem {
  icon?: string;
  content?: string;
  hrefTo?: string;
}

export type { BlogContentItem };

/* hover */
interface GetUserPropsProps {
  gender?: number;
  qq?: string;
  email?: string;
  address?: string;
  [props: string]: any;
}

interface GetUserStateProps {
  collect?: number;
  assent?: number;
  publish?: number;
  [props: string]: any;
}

export type { GetUserPropsProps, GetUserStateProps };

/* ssr */
interface SessionReq extends IncomingMessage {
  session?: any;
  [props: string]: any;
}

interface AutoDispatchTockenHandlerProps {
  store: SagaStore;
  req: SessionReq;
  res: ServerResponse;
  [props: string]: any;
}

interface AutoDispatchTockenHandlerType {
  (props: AutoDispatchTockenHandlerProps): Promise<any>;
}

interface AutoDispatchTockenHandler {
  (props: AutoDispatchTockenHandlerType): AutoDispatchTockenHandlerType;
}

export type { AutoDispatchTockenHandler, AutoDispatchTockenHandlerProps };

/* user */
interface InputProps {
  regexp: RegExp;
  success: string;
  fail: string;
}

interface LoginType {
  username: InputProps;
  password: InputProps;
}

export type { InputProps, LoginType };

/* BlogOrigin */
type BlogOriginProps = Array<{ name?: string; value: number }>;

type BlogStateType = Array<{ fieldName: string; name: string; value: number | BlogOriginProps }>;

export type { BlogOriginProps, BlogStateType };

/* manage */
interface AddModuleType {
  input: InputProps;
}

export type { AddModuleType };
