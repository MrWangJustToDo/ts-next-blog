import { RefObject } from "react";
import { mainRight } from "config/home";
import { AutoRequestType } from "./utils";
import { BlogContentProps, TypeProps } from "./hook";
import { ChildMessageProps, PrimaryMessageProps } from "./components";
import { apiName } from "config/api";

/* === Archive === */
/* archiveContent */
interface ArchiveContentType {
  (props: { year: string; blogProps: BlogContentProps[] }): JSX.Element;
}

export type { ArchiveContentType };

/* === Blog === */
interface WithImgRef {
  imgRef: RefObject<HTMLImageElement>;
}

interface BlogContentType {
  (props: BlogContentProps): JSX.Element;
}

export type { BlogContentType };

/* blogContentImg */
interface BlogContentImgType {
  (props: { src: string }): JSX.Element;
}

export type { BlogContentImgType };

/* blogContentMessage */
interface BlogContentMessageType {
  (props: { blogId: string }): JSX.Element;
}

export type { BlogContentMessageType };

/* blogContentPrimaryMessage */
interface BlogContentPrimaryMessageWrapperType {
  (props: { messages: PrimaryMessageProps[] }): JSX.Element;
}
interface BlogContentPrimaryMessageType {
  (props: {
    messages: PrimaryMessageProps[];
    primaryReplay: (props: PrimaryMessageProps) => void;
    primaryDelete: (props: PrimaryMessageProps) => void;
    primaryUpdate: (props: PrimaryMessageProps) => void;
  }): JSX.Element;
}

export type { BlogContentPrimaryMessageWrapperType, BlogContentPrimaryMessageType };

/* blogContentChildMessage */
interface BlogContentChildMessageType {
  (props: { messages: ChildMessageProps[] }): JSX.Element;
}
interface BlogContentChildMessageWithReplayType {
  (props: {
    messages: ChildMessageProps[];
    childReplay: (props: ChildMessageProps) => void;
    childDelete: (props: ChildMessageProps) => void;
    childUpdate: (props: ChildMessageProps) => void;
  }): JSX.Element;
}

export type { BlogContentChildMessageType, BlogContentChildMessageWithReplayType };

/* blogContentCheckCode */
interface BlogContentCheckCodeModuleProps {
  blogId: string;
  request: AutoRequestType;
  closeHandler: () => void;
  requestCallback: () => void;
}
interface BlogContentCheckCodeModuleType {
  (props: BlogContentCheckCodeModuleProps): JSX.Element;
}
interface BlogContentCheckCodeModuleWithImageType {
  (props: BlogContentCheckCodeModuleProps & WithImgRef): JSX.Element;
}

export type { BlogContentCheckCodeModuleType, BlogContentCheckCodeModuleWithImageType };

/* blogContentMessagePut */
interface BlogContentMessagePutType {
  (props: { blogId: string }): JSX.Element;
}

export type { BlogContentMessagePutType };

/* blogContentReplayModule */
interface BlogContentReplayModuleProps<T> {
  props: T;
  request: AutoRequestType;
  closeHandler: () => void;
}
interface BlogContentReplayModuleType {
  <T extends PrimaryMessageProps | ChildMessageProps>(props: BlogContentReplayModuleProps<T>): JSX.Element;
}
interface BlogContentReplayModuleWithImageType {
  <T extends PrimaryMessageProps | ChildMessageProps>(props: BlogContentReplayModuleProps<T> & WithImgRef): JSX.Element;
}

/* blogContentDeleteModule */
interface BlogContentDeleteModuleProps<T> {
  props: T;
  request: AutoRequestType;
  closeHandler: () => void;
}
interface BlogContentDeleteModuleType {
  <T extends PrimaryMessageProps | ChildMessageProps>(props: BlogContentDeleteModuleProps<T>): JSX.Element;
}

/* blogContentUpdateModule */
interface BlogContentUpdateModuleProps<T> {
  props: T;
  request: AutoRequestType;
  closeHandler: () => void;
}
interface BlogContentUpdateModuleType {
  <T extends PrimaryMessageProps | ChildMessageProps>(props: BlogContentUpdateModuleProps<T>): JSX.Element;
}
interface BlogContentUpdateModuleWithImageType {
  <T extends PrimaryMessageProps | ChildMessageProps>(props: BlogContentUpdateModuleProps<T> & WithImgRef): JSX.Element;
}

export type {
  WithImgRef,
  BlogContentReplayModuleProps,
  BlogContentReplayModuleType,
  BlogContentReplayModuleWithImageType,
  BlogContentDeleteModuleType,
  BlogContentDeleteModuleProps,
  BlogContentUpdateModuleProps,
  BlogContentUpdateModuleType,
  BlogContentUpdateModuleWithImageType,
};

/* BlogContentLikeToPayModule */
interface BlogContentLikeToPayModuleProps {
  aliUrl: string;
  wChatUrl: string;
}

interface BlogContentLikeToPayModuleType {
  (props: BlogContentLikeToPayModuleProps): JSX.Element;
}

export type { BlogContentLikeToPayModuleType };

/* === Login === */
interface ForWardRefType<T> {
  (props: { forWardRef: RefObject<T> }): JSX.Element;
}

export type { ForWardRefType };

interface SubmitType {
  (props: { enabled: boolean }): JSX.Element;
}

export type { SubmitType };

/* loginCheckCode */

interface LoginCheckCodeType {
  (props: { show: boolean }): JSX.Element;
}

export type { LoginCheckCodeType };

/* input */
interface LoginInputType {
  (props: { setState: (props: boolean) => void }): JSX.Element;
}

export type { LoginInputType };

/* === Main === */
/* mainRightCommend */
interface MainRightCommendType {
  (props: { index: mainRight }): JSX.Element;
}

export type { MainRightCommendType };

/* mainRightCommendItem */
interface MainRightCommendItemType {
  (props: { blogId: string; blogTitle: string }): JSX.Element;
}

export type { MainRightCommendItemType };

/* mainRightTag */
interface MainRightTagType {
  (props: { index: mainRight }): JSX.Element;
}

export type { MainRightTagType };

/* mainRightTagItem */
interface MainRightTagItemType {
  (props: { tagName: string; tagCount: number; changeCurrentTag: (props: string) => void }): JSX.Element;
}

export type { MainRightTagItemType };

/* mainRightType */

interface MainRightTypeType {
  (props: { index: mainRight }): JSX.Element;
}

export type { MainRightTypeType };

/* mainRightTypeItem */
interface MainRightTypeItemType {
  (props: { typeName: string; typeCount: number; changeCurrentType: (props: string) => void }): JSX.Element;
}

export type { MainRightTypeItemType };

/* === Type === */
/* typeContent */
interface TypeContentType {
  (props: { blogs: BlogContentProps[] }): JSX.Element | null;
}

export type { TypeContentType };

/* === Tag === */
/* tagContentType */
interface TagContentType {
  (props: { blogs: BlogContentProps[] }): JSX.Element | null;
}

export type { TagContentType };

/* === Publish === */
/* publishImageModule */
interface PublishImageModuleProps {
  inputRef: RefObject<HTMLInputElement>;
  closeHandler: () => void;
  initialUrl?: string;
}

interface PublishImageModuleType {
  (props: PublishImageModuleProps): JSX.Element;
}

export type { PublishImageModuleType };

/* publishTag */
interface TagProps {
  tagId?: string;
  tagState?: number;
  tagCount?: number;
  tagContent?: string;
}

export type { TagProps };

/* publishSubmit */
interface PublishSubmitType {
  (props: { submit: () => Promise<void> }): JSX.Element;
}

export type { PublishSubmitType };

/* === Manage === */

interface ManageAddButtonBody {
  (closeHandler: () => void): JSX.Element;
}

interface ManageAddButtonProps {
  body: ManageAddButtonBody;
}

interface ManageAddButtonTypes {
  (props: ManageAddButtonProps): JSX.Element;
}

interface ManageUserIdType {
  (props: { userId: string }): JSX.Element;
}

export type { ManageAddButtonBody, ManageAddButtonTypes, ManageUserIdType };

/* manageAddModule */
interface ManageAddModuleProps {
  fieldName: string;
  judgeApiName: apiName;
  request: AutoRequestType;
  closeHandler: () => void;
  successHandler: () => void;
}

interface ManageAddModuleType {
  (props: ManageAddModuleProps): JSX.Element;
}

export type { ManageAddModuleType };

/* manageResult */
interface ManageResultType {
  (props: BlogContentProps[]): JSX.Element;
}

export type { ManageResultType };

/* manageDeleteTagItem */
interface ManageDeleteTagItemType {
  (props: TagProps): JSX.Element;
}
interface ManageDeleteTagButtonType {
  ({ tagId, deleteItem }: { tagId: string; deleteItem: JSX.Element }): JSX.Element;
}

export type { ManageDeleteTagItemType, ManageDeleteTagButtonType };

/* manageDeleteTypeItem */
interface ManageDeleteTypeItemType {
  (props: TypeProps): JSX.Element;
}
interface ManageDeleteTypeButtonType {
  ({ typeId, deleteItem }: { typeId: string; deleteItem: JSX.Element }): JSX.Element;
}

export type { ManageDeleteTypeItemType, ManageDeleteTypeButtonType };

/* manageDeleteModule */
interface ManageDeleteModuleProps {
  request: AutoRequestType;
  deleteItem: JSX.Element;
  closeHandler: () => void;
  successHandler: () => void;
}

interface ManageDeleteModuleType {
  (props: ManageDeleteModuleProps): JSX.Element;
}

export type { ManageDeleteModuleType };
