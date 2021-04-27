import { RefObject } from "react";
import { mainRight } from "config/hoom";
import { AutoRequestType } from "./utils";
import { BlogContentProps, MyInputELement, TypeProps } from "./hook";
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
interface BlogContentPrimaryMessageType {
  (props: { messages: PrimaryMessageProps[] }): JSX.Element;
}
interface BlogContentPrimaryMessageWithReplayType {
  (props: { messages: PrimaryMessageProps[]; replay: (props: PrimaryMessageProps) => void }): JSX.Element;
}

export type { BlogContentPrimaryMessageType, BlogContentPrimaryMessageWithReplayType };

/* blogContentChildMessage */
interface BlogContentChildMessageType {
  (props: { messages: ChildMessageProps[]; primaryCommentId: string }): JSX.Element;
}
interface BlogContentChildMessageWithReplayType {
  (props: { messages: ChildMessageProps[]; replay: (props: ChildMessageProps) => void }): JSX.Element;
}

export type { BlogContentChildMessageType, BlogContentChildMessageWithReplayType };

/* blogContentCheckcode */
interface BlogContentCheckcodeModuleProps {
  request: AutoRequestType;
  closeHandler: () => void;
  successCallback: () => void;
  messageRef: RefObject<MyInputELement>;
}
interface BlogContentCheckcodeModuleType {
  (props: BlogContentCheckcodeModuleProps): JSX.Element;
}
interface BlogContentCheckcodeModuleWithImagType {
  (props: BlogContentCheckcodeModuleProps & WithImgRef): JSX.Element;
}

export type { BlogContentCheckcodeModuleType, BlogContentCheckcodeModuleWithImagType };

/* blogContentMessagePut */
interface BlogContentMessagePutType {
  (props: { blogId: string }): JSX.Element;
}

export type { BlogContentMessagePutType };

/* blogContentReplayModule */
interface BlogContentReplayModuleProps {
  toIp: string;
  toUserId: string;
  primaryCommentId: string;
  request: AutoRequestType;
  closeHandler: () => void;
}
interface BlogContentReplayModuleType {
  (props: BlogContentReplayModuleProps): JSX.Element;
}
interface BlogContentReplayModuleWithImagType {
  (props: BlogContentReplayModuleProps & WithImgRef): JSX.Element;
}

export type { BlogContentReplayModuleType, BlogContentReplayModuleWithImagType };

/* BlogContentLikeToPayModule */
interface BlogContentLikeToPayModuleProps {
  aliUrl: string;
  wchatUrl: string;
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

/* loginCheckcode */

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
  appendHandler: (url: string) => void;
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

interface ManageUserIdType {
  (props:{userId: string}): JSX.Element;
}

export type {ManageUserIdType}

/* manageAddModule */
interface ManageAddModuleProps {
  fieldname: string;
  judgeApiName: apiName;
  request: AutoRequestType;
  requestApiName: apiName;
  closeHandler: () => void;
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

export type { ManageDeleteTagItemType };

/* manageDeleteTypeItem */
interface ManageDeleteTypeItemType {
  (props: TypeProps): JSX.Element;
}

export type { ManageDeleteTypeItemType };

/* manageDeleteModule */
interface ManageDeleteModuleProps {
  request: AutoRequestType;
  item: JSX.Element;
  close: () => void;
  successCallback: () => void;
}

interface ManageDeleteModuleType {
  (props: ManageDeleteModuleProps): JSX.Element;
}

export type { ManageDeleteModuleType };
