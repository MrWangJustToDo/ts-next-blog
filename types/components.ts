import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";

type Color =
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "white"
  | "gray"
  | "gray-dark"
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger"
  | "light"
  | "dark";

interface SimpleElement {
  (): React.ReactElement;
}

export type { SimpleElement };

/* AnimationList */
interface AnimationListType {
  (props: { children: ReactChild[]; showClassName?: string, delay?:number }): JSX.Element;
}
interface AnimationItemType {
  (props: { children: ReactChild; nextIndex: number; showState: boolean; showClassName?: string; next: (index: number) => void }): JSX.Element;
}

export type { AnimationListType, AnimationItemType };

/* === BlogItem === */
interface BlogItemType {
  (props: BlogContentProps & { className?: string; _style?: { [props: string]: string } }): JSX.Element;
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
  fromUserId?: string;
  fromIp: string;
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
  children?: JSX.Element;

  withReplay?: boolean;
  withUpdate?: boolean;
  withDelete?: boolean;
  withChildren?: boolean;
  withHover?: boolean;

  replayHandler?: (props: PrimaryMessageProps) => void;
  updateHandler?: (props: PrimaryMessageProps) => void;
  deleteHandler?: (props: PrimaryMessageProps) => void;
}

interface PrimaryMessageType {
  (props: PrimaryMessageProps): JSX.Element;
}

interface ChildMessageProps {
  blogId: string;
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
  children?: JSX.Element;

  withHover?: boolean;
  withReplay?: boolean;
  withUpdate?: boolean;
  withDelete?: boolean;
  withChildren?: boolean;

  replayHandler?: (props: ChildMessageProps) => void;
  updateHandler?: (props: ChildMessageProps) => void;
  deleteHandler?: (props: ChildMessageProps) => void;
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
  _style?: { [props: string]: string };
  loadingColor?: Color;
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
  initState?: boolean;
  type?: "radio" | "checkbox";
  _style?: { [props: string]: string };
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
  initData?: Array<number>;
  multiple?: boolean;
  className?: string;
  fieldName: string;
  placeHolder?: string;
  maxHeight?: number;
  _style?: { [props: string]: string };
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
  (props: { children?: ReactElement; forwardRef: RefObject<HTMLDivElement> }): JSX.Element;
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
  changeLoading?: (props: boolean) => void;
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
  color?: Color;
}

interface LoadingType {
  (props: LoadingProps): JSX.Element;
}

export type { LoadingType };

/* === LoadingBar === */
/* index */
interface LoadingBarProps {
  forwardRef?: RefObject<HTMLDivElement>;
  height?: number;
  present?: number;
}

interface LoadingBarType {
  (props: LoadingBarProps): React.ReactElement | null;
}

export type { LoadingBarType, LoadingBarProps };

/* loadingBar */
interface BarType {
  (props: { forwardRef: RefObject<HTMLDivElement> }): JSX.Element;
}

export type { BarType };

/* === LoadRender */
import { Method } from "axios";
import { AutoRequestType, QueryProps } from "./utils";

/* index */
interface LoadRenderProps<T> {
  path?: string;
  token?: boolean;
  method?: Method;
  apiPath?: apiName;
  cacheTime?: number;
  delayTime?: number;
  query?: QueryProps;
  requestData?: object;
  initialData?: T;
  needUpdate?: boolean;
  needinitialData?: boolean;
  loaded: (props: T, fetcher: AutoRequestType) => JSX.Element | null;
  loading?: (props: LoadingProps) => JSX.Element;
  loadError?: (props: any) => JSX.Element;
  placeholder?: { [props: string]: string };
  revalidateOnMount?: boolean;
  revalidateOnFocus?: boolean;
}

interface LoadRenderType {
  <T>(props: LoadRenderProps<T>): JSX.Element | null;
}

interface RenderProps<T> {
  currentInitialData?: T;
  currentRequest: AutoRequestType;
  loaded: (props: T, fetcher: AutoRequestType) => JSX.Element | null;
  loading: (props: LoadingProps) => JSX.Element;
  loadError: (props: any) => JSX.Element;
  delayTime: number;
  revalidateOnMount: boolean;
  revalidateOnFocus: boolean;
  placeholder?: { [props: string]: string };
  apiPath?: apiName;
  needUpdate: boolean;
}

interface RenderType {
  <T>(props: RenderProps<T>): JSX.Element | null;
}

interface UseLoadingProps {
  loading: (props: LoadingProps) => JSX.Element;
  placeholder?: { [props: string]: string };
  delayTime: number;
  cancelKey: string;
}

interface UseLoadingType {
  (props: UseLoadingProps): JSX.Element | null;
}

interface GetCurrentInitialDataProps<T> {
  initialData?: T;
  needinitialData?: boolean;
  apiPath?: apiName;
}

interface GetCurrentInitialDataType {
  <T>(props: GetCurrentInitialDataProps<T>): { currentInitialData?: T };
}

interface AutoUpdateStateProps<T> {
  needUpdate?: boolean;
  apiPath?: apiName;
  initialData?: T;
  currentData: T;
}

interface AutoUpdateStateType {
  <T>(props: AutoUpdateStateProps<T>): void;
}

export type { LoadRenderProps, LoadRenderType, RenderProps, RenderType, GetCurrentInitialDataType, AutoUpdateStateType, UseLoadingType };

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
  height?: number;
  className?: string;
  showState?: boolean;
  closeHandler?: () => void;
  clear?: () => void;
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
import React, { ReactChild, ReactElement, RefObject } from "react";

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
  collectIds?: string;
  assentIds?: string;
}

export type { UserExProps, UserHoverItemType };

/* index */
interface UserHoverType {
  (props: UserHoverProps): JSX.Element | null;
}

export type { UserHoverType };
