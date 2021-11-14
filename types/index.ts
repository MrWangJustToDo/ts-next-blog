// core type

// from http://ip-api.com/json/
export interface IpAddressProps {
  country?: string;
  countryCode?: string;
  region?: string;
  city?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  query?: string;
}

export interface UserProps {
  ip: string;
  userId: string;
  username: string;
  userState: number;
  password: string;
  nickname?: string;
  address?: string;
  email?: string;
  gender?: number;
  avatar?: string;
  qq?: string;
}

export interface AuthorProps {
  userId: string;
  userAlipay: string;
  userWechat: string;
  cacheState: number;
}

export interface TypeProps {
  typeId: string;
  typeState: number;
  typeCount: number;
  typeContent: string;
}

export interface ClientTagProps {
  tagId: string[];
  tagState: number[];
  tagCount: number[];
  tagContent: string[];
}

export interface ServerTagProps {
  tagId: string;
  tagState: number;
  tagCount: number;
  tagContent: string;
}

export interface BlogProps {
  authorId: string;
  blogId: string;
  blogState: number;
  blogOriginState: number;
  // blogCreateYear: string;
  blogCreateDate: string;
  blogModifyState: number;
  blogModifyDate: string;
  blogAssentCount: number;
  blogCollectCount: number;
  blogReadCount: number;
  blogImgLink: string;
  blogPreview: string;
  blogContent: string;
  blogTitle: string;
  blogPriseState: number;
  blogCommentState: number;
  typeId: string;
  tagId: string;
}

export type HomeBlogProps = Pick<
  BlogProps,
  | "authorId"
  | "blogId"
  | "blogState"
  | "blogTitle"
  | "blogCreateDate"
  | "blogImgLink"
  | "blogPreview"
  | "blogAssentCount"
  | "blogCollectCount"
  | "blogReadCount"
  | "typeId"
  | "tagId"
> & {
  blogCreateYear: string;
};

export interface UsersExProps {
  userId: string;
  collect: number;
  assent: number;
  publish: number;
  collectIds: string;
  assentIds: string;
}

export interface PrimaryCommentProps {
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
  preview?: string;
  isMd?: number;
}

export interface ChildCommentProps {
  blogId: string;
  primaryCommentId: string;
  commentId: string;
  fromUserId?: string;
  fromIp: string;
  toIp: string;
  toUserId?: string;
  content: string;
  createDate: string;
  modifyState: number;
  modifyDate: string;
  // childIds: string;
  // childCount: number;
  preview?: string;
  isMd?: number;
}
