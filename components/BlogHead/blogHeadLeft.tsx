import { calendar } from "utils/time";
import { Image } from "components/Image";
import { getCurrentAvatar } from "utils/data";
import { flexBetween, flexCenter, getClass } from "utils/dom";
import { BlogHeadProps } from ".";

export const BlogHeadLeft = ({ gender, avatar, username, blogModifyState, blogModifyDate, blogReadCount }: BlogHeadProps) => {
  return (
    <ul className={getClass("list-unstyled text-truncate w-50 small overflow-auto m-0", flexBetween)} style={{ maxWidth: "240px" }}>
      <li className="small">
        <div className={getClass("text-secondary", flexCenter)}>
          <Image className="rounded-circle" src={getCurrentAvatar(avatar, gender)} alt={username} width="30" height="30" />
          <span className="ml-2 text-info">{username}</span>
        </div>
      </li>
      <li className="small">
        <div className="text-secondary">
          <span className="">{blogModifyState ? "更新于:" : "发布于:"}</span>
          <span className="ml-1 text-info">{calendar(blogModifyDate!)}</span>
        </div>
      </li>
      <li className="small">
        <div className="text-secondary">
          <span className="">看过: </span>
          <span className="ml-1 text-info">{blogReadCount}</span>
        </div>
      </li>
    </ul>
  );
};
