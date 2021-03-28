import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";

interface SimpleElement {
  (): JSX.Element;
}

export type { SimpleElement };

/* === BlogItem === */
interface BlogItemType {
  (props: BlogContentProps): JSX.Element;
}

export type { BlogItemType };

/* blogItemRight */
interface BlogItemRightType {
  (props: { src: string }): JSX.Element;
}

export type { BlogItemRightType };

/* === BlogMessage */
interface PrimaryMessageProps {
  blogId: string;
  commentId: string;
  userId?: string;
  ip: string;
  content: string;
  createDate: string;
  modifyState: number;
  modifyDate: string;
  childIds: string;
  childCount: number;

  // 用户相关
  avatar?: string;
  username?: string;
  address?: string;
  email?: string;
  gender?: number;
  qq?: string;
  children: JSX.Element;

  withReplay?: boolean;
  withChildren?: boolean;
  withHover?: boolean;

  replayHandler: (props: PrimaryMessageProps) => void;
}

interface PrimaryMessageType {
  (props: PrimaryMessageProps): JSX.Element;
}

interface ChildMessageProps {
  primaryCommentId: string;
  commentId: string;
  fromIp: string;
  fromUserId: string;
  toIp: string;
  toUserId: string;
  content: string;
  createDate: string;
  modifyState: number;
  modifyDate: string;

  // 用户相关
  avatar?: string;
  username?: string;
  address?: string;
  email?: string;
  gender?: number;
  qq?: string;
  toUserName?: string;
  children: JSX.Element;

  withReplay?: boolean;
  withChildren?: boolean;
  withHover?: boolean;

  replayHandler: (props: ChildMessageProps) => void;
}

interface ChildMessageType {
  (props: ChildMessageProps): JSX.Element;
}

export type { PrimaryMessageType, ChildMessageType, PrimaryMessageProps, ChildMessageProps };

/* === Button */
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  value?: string;
  disable?: boolean;
  className?: string;
  initState?: boolean;
  request: () => Promise<void>;
  style?: { [props: string]: string };
  loadingColor?: string;
}

interface ButtonType {
  (props: ButtonProps): JSX.Element;
}

export type { ButtonType };

/* === CartHead === */
interface CardHeadProps {
  icon: string;
  content: string;
  hrefTo: string;
}

interface CardHeadType {
  (props: CardHeadProps): JSX.Element;
}

export type { CardHeadType };

/* === CheckBox === */
interface CheckBoxProps {
  init?: boolean;
  type?: "radio" | "checkbox";
  style?: { [props: string]: string };
  className?: string;
  fieldName: string;
}

interface CheckBoxType {
  (props: CheckBoxProps): JSX.Element;
}

export type { CheckBoxType };

/* === CheckBox === */
/* index */
type ValueType = string | number;

interface DropProps<T> {
  data?: Array<{ name?: string; value: T }>;
  multiple?: boolean;
  className?: string;
  fieldName: string;
  placeHolder?: string;
  maxHeight?: number;
  style?: { [props: string]: string };
}
interface DropType {
  <T extends ValueType>(props: DropProps<T>): JSX.Element;
}

export type { DropType, DropProps, ValueType };

/* dropItem */
interface DropItemProps<T> {
  value: T;
  name?: string;
  index?: number;
  checkedIndex?: number[];
  clickHandler?: (props: number) => void;
}
interface DropItemType {
  <T extends ValueType>(props: DropItemProps<T>): JSX.Element;
}

export type { DropItemProps, DropItemType };

/* dropContainer */
interface DropContainerType {
  (props: { length: number; bool: boolean; children: object; maxHeight?: number }): JSX.Element;
}

export type { DropContainerType };

/* dropSelectItem */
interface DropSelectItemProps<T> {
  idx: number;
  name?: string;
  multiple?: boolean;
  value: T;
  cacel: (props: number) => void;
}
interface DropSelectItemType {
  <T>(props: DropSelectItemProps<T>): JSX.Element;
}

export type { DropSelectItemType };

/* === Footer === */
/* footContainerContactMe */
interface FootContainerContactMeProps {
  length?: number;
  [props: string]: any;
}

interface FootContainerContactMeType {
  (props: FootContainerContactMeProps): JSX.Element;
}

export type { FootContainerContactMeType };

/* footContainerContentItem */
interface FootContainerProps {
  column?: number;
  head?: string;
  content?: string;
  icon?: string;
  hrefTo?: string;
  title?: string;
  [props: string]: any;
}

interface FootContainerContentItemType {
  (props: FootContainerProps): JSX.Element;
}

export type { FootContainerContentItemType };

/* footContainerRecommend */
interface FootContainerRecommendProps {
  length?: number;
  [props: string]: any;
}

interface FootContainerRecommendType {
  (props: FootContainerRecommendProps): JSX.Element;
}

export type { FootContainerRecommendType };

/* footContainerYiYan */
interface HitokotoData {
  hitokoto?: string;
  from_who?: string;
  from?: string;
}

interface YiYanComponent {
  ({ hitokoto, from_who, from }: HitokotoData): JSX.Element;
}

export type { YiYanComponent };

/* === Header === */
/* headContainerButton */
interface HeadContainerTagNavBtnType {
  (props: { handler: () => void }): JSX.Element;
}

export type { HeadContainerTagNavBtnType };

/* headContainerItem */
interface HeadContainerProps {
  value?: string;
  icon?: string;
  hrefTo?: string;
}

interface HeadContainerItemType {
  (props: HeadContainerProps): JSX.Element;
}

export type { HeadContainerItemType };

/* headContainerList */
interface HeadContainerListType {
  (props: { show: boolean }): JSX.Element;
}

export type { HeadContainerListType };

/* === Hover === */
/* animate */
interface AnimateType {
  (props: { children?: JSX.Element; show: boolean }): JSX.Element;
}

export type { AnimateType };

/* index */
interface HoverProps {
  className?: string;
  children: JSX.Element;
  hoverItem: JSX.Element;
}

interface HoverType {
  (props: HoverProps): JSX.Element;
}

export type { HoverType };

/* === Input === */

interface InputEleProps {
  type?: string;
  name?: string;
  option: InputProps;
  forWardRef?: RefObject<HTMLInputElement>;
  changeState?: (props: boolean) => void;
  placeHolder?: string;
  judgeApiName?: apiName;
  outerClassName?: string;
  innerClassName?: string;
  failClassName?: string;
  loadingClassName?: string;
  successCalsssName?: string;
}

interface InputEleType {
  (props: InputEleProps): JSX.Element;
}

export type { InputEleType };

/* === Loading === */
/* loading */
interface LoadingProps {
  className?: string;
  _style?: { [props: string]: string };
  color?: string;
}

interface LoadingType {
  (props: LoadingProps): JSX.Element;
}

export type { LoadingType };

/* === LoadingBar === */
/* index */
interface LoadingBarProps {
  height?: number;
  present?: number;
  loading?: boolean;
}

interface LoadingBarType {
  (props: LoadingBarProps): JSX.Element;
}

export type { LoadingBarType, LoadingBarProps };

/* loadingBar */
interface BarProps extends LoadingBarProps {
  autoAdd: () => NodeJS.Timeout;
}

interface BarType {
  (props: BarProps): JSX.Element;
}

export type { BarType };

/* === LoadRender */
import { Method } from "axios";
import { QueryProps } from "./utils";
import { AnyAction } from "redux";

/* index */
interface LoadRenderProps<T> {
  path?: string;
  token?: boolean;
  method?: Method;
  apiPath?: apiName;
  delayTime?: number;
  query?: QueryProps;
  requestData?: object;
  initialData?: T;
  needUpdate?: boolean;
  needinitialData?: boolean;
  fetcher?: (...args: any) => any;
  loaded: (props: T) => JSX.Element | null;
  loading?: (props: LoadingProps) => JSX.Element;
  loadError?: (props: any) => JSX.Element;
  placeholder?: { [props: string]: string };
  revalidateOnMount?: boolean;
  revalidateOnFocus?: boolean;
}

interface LoadRenderType {
  <T>(props: LoadRenderProps<T>): JSX.Element | null;
}

interface GetCurrentInitialDataProps<T> {
  initialData?: T;
  needinitialData?: boolean;
  apiPath?: apiName;
}

interface GetCurrentInitialDataType {
  <T>(props: GetCurrentInitialDataProps<T>): { initialData?: T; dispatch: (props: AnyAction) => void };
}

interface AutoUpdateStateProps<T> {
  dispatch: (props: AnyAction) => void;
  needUpdate?: boolean;
  apiPath?: apiName;
  initialData?: T;
  currentData: T;
}

interface AutoUpdateStateType {
  <T>(props: AutoUpdateStateProps<T>): void;
}

export type { LoadRenderProps, LoadRenderType, GetCurrentInitialDataType, AutoUpdateStateType };

/* loading */
interface LoadingProps {
  className?: string;
  _style?: { [props: string]: string };
}

/* loadingError */
interface LoadingErrorType {
  (error: string): JSX.Element;
}

export type { LoadingErrorType };

/* === Overlay === */
interface OverlayProps {
  head: JSX.Element | string;
  body: ((closeHandler: () => void) => JSX.Element) | JSX.Element;
  foot?: JSX.Element;
  className?: string;
  showState?: boolean;
  closeHandler?: () => void;
}

interface OverlayType {
  (props: OverlayProps): JSX.Element;
}

export type { OverlayType, OverlayProps };

/* === PageFoot */
/* index */
interface FootPageProps {
  page: number;
  increaseAble: boolean;
  decreaseAble: boolean;
  increasePage: () => void;
  decreasePage: () => void;
  className?: string;
}
interface FootPageType {
  (props: FootPageProps): JSX.Element;
}

export type { FootPageType };

/* === Tag === */
/* index */
interface TagType {
  (props: { tagContent: string; tagCount: number; className?: string; hoverAble?: boolean }): JSX.Element;
}

export type { TagType };

/* === Toast === */
import { toastState } from "config/toast";
import { InputProps } from "./config";
import { RefObject } from "react";

interface ToastProps {
  title: string;
  content: string | JSX.Element;
  contentState?: toastState;
  currentTime?: Date;
  showState?: boolean;
  closeHandler?: () => void;
  autoCloseSecond?: number;
}

interface ToastType {
  (props: ToastProps): JSX.Element;
}

export type { ToastProps, ToastType };

/* === Type === */
interface TypeType {
  (props: { typeContent: string; typeCount: number; className?: string; hoverAble?: boolean }): JSX.Element;
}

export type { TypeType };

/* === UserHover === */
interface UserHoverProps extends BlogContentProps {
  children?: JSX.Element;
}

/* hoverItem */
interface UserHoverItemType {
  (props: UserHoverProps): JSX.Element;
}
interface UserExProps {
  userId?: string;
  collect?: number;
  assent?: number;
  publish?: number;
  collectIds?: number;
  assentIds?: number;
}

export type { UserExProps, UserHoverItemType };

/* index */
interface UserHoverType {
  (props: UserHoverProps): JSX.Element | null;
}

export type { UserHoverType };
