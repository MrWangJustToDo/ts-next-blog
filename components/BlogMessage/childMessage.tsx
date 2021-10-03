import { useCallback, useMemo } from "react";
import Image from "components/Image";
import LoadRender from "components/LoadRender";
import UserHover from "components/UserHover";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import { momentTo } from "utils/time";
import { getCurrentAvatar } from "utils/data";
import { markNOLineNumber } from "utils/markdown";

import { UserProps } from "types/hook";
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
    isMd,
    preview,
    replayHandler,
    updateHandler,
    deleteHandler,
    previewMod = true,
    withHover = true,
    withReplay = true,
    withUpdate = false,
    withDelete = false,
    withChildren = true,
  } = props;
  const replayCallback = useCallback(() => typeof replayHandler === "function" && replayHandler(props), [replayHandler, props]);

  const updateCallback = useCallback(() => typeof updateHandler === "function" && updateHandler(props), [updateHandler, props]);

  const deleteCallback = useCallback(() => typeof deleteHandler === "function" && deleteHandler(props), [deleteHandler, props]);

  const src = useMemo(() => getCurrentAvatar(avatar, gender), [avatar, gender]);

  const renderContent = useMemo(() => (previewMod ? preview || content : isMd ? markNOLineNumber.render(content) : content), [isMd, content, previewMod]);

  return (
    <div className={getClass("media py-2", style.childMessage)}>
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
          {toUserName ? (
            <LoadRender<UserProps>
              apiPath={apiName.userName}
              query={{ userName: toUserName }}
              loaded={(props) => {
                return (
                  <div style={{ display: "inline-block", cursor: "pointer" }}>
                    <UserHover {...props}>
                      <span className={getClass("text-info px-2 rounded text-truncate align-middle", style.author)}>@ {toUserName}</span>
                    </UserHover>
                  </div>
                );
              }}
            />
          ) : (
            <span className={getClass("text-info px-2 rounded text-truncate align-middle", style.author)}>{toIp}</span>
          )}
          <span className="float-right badge badge-primary">{(modifyState ? "更新于：" : "回复于：") + momentTo(modifyDate)}</span>
        </h5>
        {isMd && !previewMod ? (
          <p className="mb-2 mb-md-3 pb-1 border-bottom rounded typo" style={{ fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: renderContent }} />
        ) : (
          <p className="mb-2 mb-md-3 pb-1 border-bottom rounded">{renderContent}</p>
        )}
        <div className={style.btnContainer}>
          {withReplay && (
            <button className={getClass("btn btn-outline-info", style.replay)} onClick={replayCallback}>
              回复
            </button>
          )}
          {withUpdate && (
            <button className={getClass("btn btn-outline-primary", style.update)} onClick={updateCallback}>
              更新
            </button>
          )}
          {withDelete && (
            <button className={getClass("btn btn-outline-danger", style.delete)} onClick={deleteCallback}>
              删除
            </button>
          )}
        </div>
        {withChildren && children}
      </div>
    </div>
  );
};

export default ChildMessage;
