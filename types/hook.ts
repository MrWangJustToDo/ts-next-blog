import { State } from "store";
import { RefObject } from "react";
import { AnyAction } from "redux";
import { apiName } from "config/api";
import { InputProps } from "./config";
import { AutoRequestProps, AutoRequestType } from "./utils";
import { ChildMessageProps, LoadingBarProps, OverlayProps, ToastProps } from "./components";
import { actionName } from "config/action";

interface UserProps {
  ip?: string;
  userId?: string;
  username?: string;
  userState?: number;
  password?: string;
  nickname?: string;
  address?: string;
  email?: string;
  gender?: number;
  avatar?: string;
  qq?: string;
}

interface TypeProps {
  typeId?: string;
  typeState?: number;
  typeCount?: number;
  typeContent?: string;
}

interface TagProps {
  tagId?: string[];
  tagState?: number[];
  tagCount?: number[];
  tagContent?: string[];
}

interface BlogProps {
  authorId?: string;
  blogId?: string;
  blogState?: number;
  blogOriginState?: number;
  blogCreateYear?: string;
  blogCreateDate?: string;
  blogModifyState?: number;
  blogModifyDate?: string;
  blogAssentCount?: number;
  blogCollectCount?: number;
  blogReadCount?: number;
  blogImgLink?: string;
  blogPreview?: string;
  blogContent?: string;
  blogTitle?: string;
  blogPriseState?: number;
  blogCommentState?: number;
}

type BlogContentProps = UserProps & BlogProps & TypeProps & TagProps;

export type { UserProps, TypeProps, TagProps, BlogProps, BlogContentProps };

/* useAnimate */
interface UseShowAndHideAnimateProps<T> {
  state: boolean;
  key?: string;
  forWardRef?: RefObject<T>;
  showClassName?: string;
  hideClassName?: string;
}
interface UseShowAndHideAnimateType {
  <T extends HTMLElement>(props: UseShowAndHideAnimateProps<T>): RefObject<T>;
}

export type { UseShowAndHideAnimateProps, UseShowAndHideAnimateType };

/* useArchive */
interface ArchiveProps {
  [year: string]: BlogContentProps[];
}
interface UseArchiveType {
  (): { value: ArchiveProps | null; canLoad: boolean; loadMore: () => void; allCount: number };
}
interface UseAutoLoadArchiveType {
  (props: { canLoad: boolean; loadMore: () => void; breakPoint: number }): void;
}

export type { ArchiveProps, UseArchiveType, UseAutoLoadArchiveType };

/* useAuto */
interface UseAutoActionHandlerProps<T, K> {
  action: (e?: T) => void;
  actionState?: boolean; // 当前需要执行的状态，在事件监听回调中用于判断是否还需要绑定监听，在定时器中用于判断本次action是否需要执行
  timmer?: boolean; // 是否使用定时器
  once?: boolean; // 执行一次，for timmer
  delayTime?: number; // 定时器执行时间间隔
  rightNow?: boolean; // 立即执行，for listner
  // 适应React 17 的更新
  currentRef?: RefObject<K>;
  addListener?: (action: (e?: T) => void, ele?: K) => void; // 添加事件监听
  removeListener?: (action: (e?: T) => void, ele?: K) => void; // 移除事件监听
}
interface UseAutoActionHandlerType {
  <T extends Event, K>(props: UseAutoActionHandlerProps<T, K>, ...deps: any[]): void;
}
interface UseAutoSetHeaderHeightType {
  <T extends HTMLElement>(breakPoint?: number): { ref: RefObject<T>; height: number };
}
interface UseAutoLoadCheckcodeImgProps {
  imgUrl: apiName;
  strUrl: apiName;
  state?: boolean;
}
interface UseAutoLoadCheckcodeImgType {
  <T extends HTMLImageElement>(props: UseAutoLoadCheckcodeImgProps): RefObject<T>;
}
interface UseAutoShowAndHideType {
  <T extends HTMLElement>(breakPoint: number): RefObject<T>;
}
interface UseAutoSetHeightProps<T> {
  forWardRef?: RefObject<T>;
  maxHeight?: number;
  deps?: any[];
}
interface UseAutoSetHeightType {
  <T extends HTMLElement>(props?: UseAutoSetHeightProps<T>): [RefObject<T>, number];
}
interface UseAutoLoadRandomImgProps {
  imgUrl: apiName;
  initUrl?: string;
}
interface UseAutoLoadRandomImgType {
  (props: UseAutoLoadRandomImgProps): [RefObject<HTMLImageElement>, boolean];
}

export type {
  UseAutoActionHandlerProps,
  UseAutoActionHandlerType,
  UseAutoSetHeaderHeightType,
  UseAutoLoadCheckcodeImgProps,
  UseAutoLoadCheckcodeImgType,
  UseAutoShowAndHideType,
  UseAutoSetHeightProps,
  UseAutoSetHeightType,
  UseAutoLoadRandomImgType,
};

/* useBase */
interface UseCurrentStateType {
  (): { state: State; dispatch: (props: AnyAction) => void };
}
interface UseBasePageProps<T> {
  stateSide?: "server" | "client";
  pageLength?: number;
  stateName?: apiName | actionName;
  data?: Array<T>;
}
interface UseBasePageType {
  <T>(props: UseBasePageProps<T>): {
    allData: Array<T>;
    allPage: number;
    currentPage: number;
    currentPageData: Array<T>;
    increaseAble: boolean;
    decreaseAble: boolean;
    increasePage: () => void;
    decreasePage: () => void;
  };
}

export type { UseCurrentStateType, UseBasePageProps, UseBasePageType };

/* useBlog */
interface UseBlogMenuType {
  (className: string): boolean;
}
interface UseAutoScrollType {
  <T extends HTMLElement>(): RefObject<T>;
}
interface UseLinkToImgType {
  <T extends HTMLElement>(): RefObject<T>;
}
interface UseEditorType {
  (id: string): void;
}
interface UsePublishProps {
  id: string;
  request: AutoRequestType;
}
interface UsePublishType {
  (props: UsePublishProps): [RefObject<HTMLFormElement>, () => Promise<void>];
}
interface UseUpdateBlogReadType {
  (props: string): void;
}
interface UseLikeToPayModuleProps {
  body: JSX.Element;
  className?: string;
}
interface UseLikeToPayModuleType {
  (props: UseLikeToPayModuleProps): () => void;
}
interface UseInputToImageModuleProps {
  className?: string;
  inputRef: RefObject<HTMLInputElement>;
  appendHandler: (url: string) => void;
  body: (appendHandler: (props: string) => void) => (ref: RefObject<HTMLInputElement>) => (closeHandler: () => void) => JSX.Element;
}
interface UseInputToImageModuleType {
  (props: UseInputToImageModuleProps): () => void;
}
interface AuthorProps {
  userId?: string;
  userAlipay?: string;
  userWechat?: string;
  cacheState?: number;
}

export type {
  AuthorProps,
  UseBlogMenuType,
  UseAutoScrollType,
  UseLinkToImgType,
  UseEditorType,
  UsePublishProps,
  UsePublishType,
  UseInputToImageModuleType,
  UseUpdateBlogReadType,
  UseLikeToPayModuleType,
};

/* useData */
interface UseBoolResult {
  bool: boolean;
  boolState: boolean;
  switchBool: () => void;
  switchBoolThrottle: () => void;
  switchBoolState: () => void;
  show: () => void;
  showThrottle: () => void;
  showState: () => void;
  hide: () => void;
  hideDebounce: () => void;
  hideDebounceState: () => void;
  hideDebounceNoState: () => void;
}
interface UseBoolType {
  (props?: { init?: boolean; stateChangeTimeStep?: number; key?: string }): UseBoolResult;
}
interface UseArrayType {
  <T>(init: T[]): [T[], (val: T) => void, (val: T) => void, (val: T) => void, (val: T) => void];
}

export type { UseBoolType, UseArrayType };

/* useHeader */
interface UseHeaderItemType {
  (): { currentHeader: string; changeCurrentHeader: (headItem: string) => void };
}

export type { UseHeaderItemType };

/* useHome */
interface UseHomeType {
  (): {
    blogs: Array<BlogContentProps>;
    allPage: number;
    currentPage: number;
    currentPageBlogs: Array<BlogContentProps>;
    increaseAble: boolean;
    decreaseAble: boolean;
    increasePage: () => void;
    decreasePage: () => void;
  };
}
interface UseCommendType {
  (): { commendBlogs: BlogContentProps[] };
}

export type { UseHomeType, UseCommendType };

/* useLoadingBar */
interface UseLoadReturn {
  start: () => void;
  end: () => void;
  state: LoadingBarProps;
  autoAdd: () => NodeJS.Timeout;
}
interface UseLoadType {
  (props: LoadingBarProps): UseLoadReturn;
}

export type { UseLoadType };

/* useManage */
interface UseSearchType {
  (props: { request: AutoRequestType }): [RefObject<HTMLFormElement>, () => Promise<void>];
}
interface UseManageToAddModuleProps {
  title: string;
  body: (request: AutoRequestType) => (judgeApiName: apiName) => (requestApiName: apiName) => (closeHandler: () => void) => JSX.Element;
  judgeApiName: apiName;
  requestApiName: apiName;
  request: AutoRequestType;
  className?: string;
}
interface UseManageToAddModuleType {
  (props: UseManageToAddModuleProps): () => void;
}
interface UseAddRequestProps {
  request: AutoRequestType;
  successCallback: () => void;
}
interface UseAddRequestType {
  (props: UseAddRequestProps): [ref: RefObject<HTMLInputElement>, request: () => Promise<void>];
}
interface UseJudgeInputProps {
  option: InputProps;
  forWardRef?: RefObject<HTMLInputElement>;
  judgeApiName?: apiName;
  failClassName: string;
  successClassName: string;
  loadingClassName: string;
}
interface UseJudgeInputType {
  (props: UseJudgeInputProps): [RefObject<HTMLInputElement>, boolean];
}
interface UseManageToDeleteModuleProps {
  title: string;
  item: JSX.Element;
  request: AutoRequestType;
  successCallback: () => void;
  body: ({
    request,
    item,
    successCallback,
  }: {
    request: AutoRequestType;
    item: JSX.Element;
    successCallback: () => void;
  }) => (close: () => void) => JSX.Element;
  // body: (request: AutoRequestType) => (item: JSX.Element) => (successCallback: () => void) => (close: () => void) => JSX.Element;
}
interface UseManageToDeleteModuleType {
  (props: UseManageToDeleteModuleProps): () => void;
}
interface UseDeleteRequestProps {
  request: AutoRequestType;
  successCallback: () => void;
  close: () => void;
}
interface UseDeleteRequestType {
  (props: UseDeleteRequestProps): () => Promise<void>;
}

export type { UseSearchType, UseManageToAddModuleType, UseAddRequestType, UseJudgeInputType, UseManageToDeleteModuleType, UseDeleteRequestType };

/* useMessage */
interface UseChildMessageType {
  (props: ChildMessageProps[]): { messageProps: ChildMessageProps[]; more: boolean; loadMore: () => void };
}
type MyInputELement = HTMLInputElement | HTMLTextAreaElement;
interface UseJudgeInputValueType {
  <T extends MyInputELement>(ref: RefObject<T>): boolean;
}
interface UsePutToCheckcodeModuleProps {
  className: string;
  blogId: string;
  body: (request: AutoRequestType) => (ref: RefObject<MyInputELement>) => (successCallback: () => void) => (closeHandler: () => void) => JSX.Element;
}
interface UsePutToCheckcodeModuleType {
  <T extends MyInputELement>(props: UsePutToCheckcodeModuleProps): {
    ref: RefObject<T>;
    canSubmit: boolean;
    submit: () => void;
  };
}
interface UseCheckcodeModuleToSubmitProps {
  messageRef: RefObject<MyInputELement>;
  request: AutoRequestType;
  closeHandler: () => void;
  successCallback: () => void;
}
interface UseCheckcodeModuleToSubmitType {
  <T extends MyInputELement>(props: UseCheckcodeModuleToSubmitProps): {
    ref: RefObject<T>;
    canSubmit: boolean;
    submit: () => Promise<void>;
  };
}
interface UseMessageToReplayModuleProps<T> {
  body: (request: AutoRequestType) => (props: T) => (closeHandler: () => void) => JSX.Element;
  className: string;
}
interface UseMessageToReplayModuleType {
  <T>(props: UseMessageToReplayModuleProps<T>): (props: T) => void;
}
interface UseReplayModuleToSubmitProps {
  request: AutoRequestType;
  closeHandler: () => void;
  successCallback?: () => void;
  toIp: string;
  toUserId: string;
  primaryCommentId: string;
}
interface UseReplayModuleToSubmitType {
  <T extends MyInputELement, F extends MyInputELement>(props: UseReplayModuleToSubmitProps): {
    input1: RefObject<T>;
    input2: RefObject<F>;
    submit: () => Promise<void>;
    canSubmit: boolean;
  };
}

export type {
  UseChildMessageType,
  MyInputELement,
  UseJudgeInputValueType,
  UsePutToCheckcodeModuleProps,
  UsePutToCheckcodeModuleType,
  UseCheckcodeModuleToSubmitProps,
  UseCheckcodeModuleToSubmitType,
  UseMessageToReplayModuleProps,
  UseMessageToReplayModuleType,
  UseReplayModuleToSubmitProps,
  UseReplayModuleToSubmitType,
};

/* useOverlay */
interface UseOverlayOpenType {
  (props: OverlayProps): void;
}
interface UseOverlayPropsType {
  (): { overlay: OverlayProps | null; open: UseOverlayOpenType };
}

export type { UseOverlayPropsType, UseOverlayOpenType };

/* useType */
interface UseTypeResult {
  type: TypeProps[];
  currentType: string;
  changeCurrentType: (nextTag: string) => void;
  allPage: number;
  currentPage: number;
  currentPageBlogs: BlogContentProps[];
  increaseAble: boolean;
  decreaseAble: boolean;
  increasePage: () => void;
  decreasePage: () => void;
}
interface UseTypeType {
  (blogs?: BlogContentProps[]): UseTypeResult;
}

export type { UseTypeType };

/* useTag */
interface Tag {
  tagId: string;
  tagState: number;
  tagCount: number;
  tagContent: string;
}
interface UseTagResult {
  tag: Tag[];
  currentTag: string;
  changeCurrentTag: (nextTag: string) => void;
  allPage: number;
  currentPage: number;
  currentPageBlogs: BlogContentProps[];
  increaseAble: boolean;
  decreaseAble: boolean;
  increasePage: () => void;
  decreasePage: () => void;
}
interface UseTagType {
  (blogs?: BlogContentProps[]): UseTagResult;
}

export type { UseTagType };

/* useToast */
interface UseToastPushType {
  (props: ToastProps): void;
}
interface UseToastPropsType {
  (init: ToastProps[]): { toast: ToastProps[]; push: UseToastPushType };
}
interface UseContentToastType {
  (): (content: string) => Promise<void>;
}

export type { UseToastPropsType, UseToastPushType, UseContentToastType };

/* useUser */
interface UseAutoLoginType {
  (): void;
}
interface UseCurrentUserType {
  (): UserProps;
}
interface UseLoginType {
  (): RefObject<HTMLFormElement>;
}
interface UseLogoutType {
  (): () => Promise<void>;
}
interface UseUserRequest {
  (props?: AutoRequestProps): AutoRequestType;
}

export type { UseAutoLoginType, UseCurrentUserType, UseLoginType, UseLogoutType, UseUserRequest };
