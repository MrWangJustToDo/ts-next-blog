import Image from "next/image";
import { useCallback, useMemo } from "react";
import UserHover from "components/UserHover";
import { momentTo } from "utils/time";
import { getClass } from "utils/class";
import { getCurrentAvatar } from "utils/data";
import { PrimaryMessageType } from "types/components";

import style from "./index.module.scss";

let PrimaryMessage: PrimaryMessageType;

PrimaryMessage = (props) => {
  const {
    modifyState,
    modifyDate,
    content,
    avatar,
    gender,
    username,
    fromIp,
    children,
    replayHandler,
    withHover = true,
    withReplay = true,
    withChildren = true,
  } = props;

  const replayCallback = useCallback(() => typeof replayHandler === "function" && replayHandler(props), [props]);

  const src = useMemo(() => getCurrentAvatar(avatar, gender), [avatar, gender]);

  return (
    <div className="media py-2">
      {withHover ? (
        <UserHover {...props}>
          <Image src={src} className="rounded" alt="头像" width="38" height="38" />
        </UserHover>
      ) : (
        <Image src={src} className="rounded" alt="头像" width="38" height="38" />
      )}
      <div className="media-body ml-2 ml-md-3 border-bottom border-danger rounded pb-1">
        <h5 className="small border-top border-info rounded pt-1">
          <span className={getClass("text-info px-2 rounded text-truncate align-middle", style.author)}>{username ? username : fromIp}</span>
          <span className="float-right badge badge-primary align-middle">{modifyState ? "更新于：" : "回复于：" + momentTo(modifyDate)}</span>
        </h5>
        <p className="mb-0 mb-md-3">{content}</p>
        {withReplay && (
          <button className={getClass("btn btn-outline-info", style.replay)} onClick={replayCallback}>
            replay
          </button>
        )}
        {withChildren && children}
      </div>
    </div>
  );
};

export default PrimaryMessage;
