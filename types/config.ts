/* api */
import { SagaStore } from "store/type";
import { ServerResponse } from "http";
import { IncomingMessage } from "http";
import { Method } from "axios";
import { CacheConfigProps, UserConfigProps } from "server/type";
import { BlogProps } from "types";

/* api */
interface AccessType {
  [props: string]: { disable?: boolean; token?: boolean; method?: Method; config?: { cache?: CacheConfigProps; user?: UserConfigProps; encode?: boolean } };
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
  [props: string]: any;
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

/* home */
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

interface AutoDispatchTokenHandlerProps {
  req: SessionReq;
  res: ServerResponse;
  [props: string]: any;
}

interface AutoDispatchTokenHandlerType {
  (store: SagaStore): (props: AutoDispatchTokenHandlerProps) => Promise<any>;
}

interface WrapperDispatchHandlerType {
  (props: AutoDispatchTokenHandlerProps & { store: SagaStore }): Promise<any>;
}

interface AutoDispatchTokenHandler {
  (props: WrapperDispatchHandlerType): AutoDispatchTokenHandlerType;
}

export type { AutoDispatchTokenHandler, AutoDispatchTokenHandlerProps };

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

/* manage */
interface AddModuleType {
  input: InputProps;
}

export type { AddModuleType };

/* publish */
type BlogStateType = Array<{
  fieldName: keyof Pick<BlogProps, "blogState" | "blogCommentState" | "blogPriseState">;
  name: string;
  value: string | Array<{ name: string; value: string }>;
}>;

export type { BlogStateType };
