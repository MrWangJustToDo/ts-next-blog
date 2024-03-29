import { Image } from "components/Image";
import { LoadRender } from "components/LoadRender";
import { apiName } from "config/api";
import { getUserProps, getUserState } from "config/hover";
import { getCurrentAvatar } from "utils/data";
import { getClass, flexAround, flexBetween, flexCenter, flexStart } from "utils/dom";
import { UserExProps, UserHoverItemType } from "types/components";

import style from "./index.module.scss";

export const UserHoverItem: UserHoverItemType = (props) => {
  const { avatar, gender, username, userId } = props;
  return (
    <div className="card border-0">
      <div className={getClass(flexAround, "card-body p-2")}>
        <div className={getClass("rounded-circle overflow-hidden", style.imgHover)}>
          <Image src={getCurrentAvatar(avatar, gender)} layout="responsive" width="100%" height="100%" alt={username} />
        </div>
        <div className={getClass("w-50", flexCenter)}>
          <i className="ri-user-line" />
          <span className="ml-2">{username || "oops !"}</span>
        </div>
      </div>
      <div className="card-body text-left py-2">
        <LoadRender<UserExProps> apiPath={apiName.userEx} token query={{ userId: userId! }} loaded={Loaded} />
        <hr className="mt-2 mb-2" />
        {getUserProps(props).map(({ key, icon, value }) => (
          <div key={key} className={getClass(flexStart, "m-1")}>
            <i className={icon} />
            <span className="ml-1 border-left pl-1">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

let Loaded = (data: UserExProps) => {
  return (
    <div className={getClass(flexBetween)}>
      {getUserState(data).map(({ key, icon, value }) => {
        return (
          <div className={getClass(flexCenter)} key={key}>
            <i className={icon} />
            <span className="ml-2">{value}</span>
          </div>
        );
      })}
    </div>
  );
};
