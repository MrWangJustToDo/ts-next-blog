import dynamic from "next/dynamic";
import { Image } from "components/Image";
import { blogContentArray } from "config/blogItem";
import { getCurrentAvatar } from "utils/data";
import { getClass, flexEnd, flexStart } from "utils/dom";
import type { HomeBlogProps, UserProps } from "types";
import type { UserHoverProps } from "types/components";

import style from "./index.module.scss";

const UserHover = dynamic<UserHoverProps>(() => import("components/UserHover").then((r) => r.UserHover));

export const BlogItemLeftUl = (props: HomeBlogProps & UserProps) => {
  const { blogAssentCount, blogCollectCount, blogReadCount, avatar, gender, username } = props;

  const arr = [blogAssentCount, blogCollectCount, blogReadCount];

  return (
    <ul className={getClass(style.ulStyle, "list-unstyled d-table text-center mb-3 mb-lg-0")}>
      <li className="d-table-cell align-middle">
        <UserHover {...props}>
          <div className={getClass("small text-secondary", flexStart)}>
            <Image className="rounded-circle" src={getCurrentAvatar(avatar, gender)} alt="头像" width="28" height="28" />
            <div className="ml-2 text-truncate">{username}</div>
          </div>
        </UserHover>
      </li>
      {blogContentArray.map(({ icon, content }, index) => {
        return (
          <li className="d-table-cell align-middle" key={icon}>
            <div className={getClass("small text-secondary", flexEnd)} title={content}>
              <div className={getClass(style.iconTransform)}>
                {icon && <i className={icon} />}
                <div className="ml-2 text-truncate">{arr[index]}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
