import Image from "next/image";
import { useCallback, useMemo } from "react";
import UserHover from "components/UserHover";
import { momentTo } from "utils/time";
import { getClass } from "utils/dom";
import { getCurrentAvatar } from "utils/data";
import { ChildMessageType } from "types/components";

import style from "./index.module.scss";

const ChildMessage: ChildMessageType = (props) => {
  const {
    modifyState,
    modifyDate,
    content,
    avatar,
    gender,
    username,
    fromIp,
    toIp,
    toUserName,
    children,
    replayHandler,
    withHover = true,
    withReplay = true,
    withChildren = true,
  } = props;
  const replayCallback = useCallback(() => typeof replayHandler === "function" && replayHandler(props), [replayHandler, props]);

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
      <div className="media-body ml-2 ml-md-3">
        <h5 className="small pt-1 border-top rounded">
          <span className={getClass("text-info px-2 rounded text-truncate align-middle", style.author)}>{username ? username : fromIp}</span>
          <span className="mx-1 align-middle">回复</span>
          <span className={getClass("text-info px-2 rounded text-truncate align-middle", style.author)}>{toUserName ? toUserName : toIp}</span>
          <span className="float-right badge badge-primary">{modifyState ? "更新于：" : "回复于：" + momentTo(modifyDate)}</span>
        </h5>
        <p className="mb-2 mb-md-3 pb-1 border-bottom rounded">{content}</p>
        {withReplay && (
          <button className={getClass("btn btn-outline-info", style.replay)} onClick={replayCallback}>
            回复
          </button>
        )}
        {withChildren && children}
      </div>
    </div>
  );
};

export default ChildMessage;
