import { useCallback, useMemo } from "react";
import { Image } from "components/Image";
import { UserHover } from "components/UserHover";
import { getClass } from "utils/dom";
import { momentTo } from "utils/time";
import { getCurrentAvatar } from "utils/data";
import { markNOLineNumber } from "utils/markdown";
import { PrimaryMessageType } from "types/components";

import style from "./index.module.scss";

const PrimaryMessage: PrimaryMessageType = (props) => {
  const {
    modifyState,
    modifyDate,
    content,
    avatar,
    gender,
    username,
    fromIp,
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

  const renderContent = useMemo(
    () => (previewMod ? preview || content : isMd ? markNOLineNumber.render(content) : content),
    [previewMod, preview, content, isMd]
  );

  return (
    <div className="media py-2">
      {withHover ? (
        <UserHover {...props}>
          <Image src={src} className="rounded" alt="头像" width="38" height="38" />
        </UserHover>
      ) : (
        <Image src={src} className="rounded" alt="头像" width="38" height="38" />
      )}
      <div className="media-body ml-2 ml-md-3 border-bottom rounded pb-1">
        <h5 className={getClass("small border-top rounded py-1", style.messageHead)}>
          <span className={getClass("text-info px-2 rounded text-truncate align-middle", style.author)}>{username ? username : fromIp}</span>
          <span className="float-right badge badge-primary align-middle">{(modifyState ? "更新于：" : "回复于：") + momentTo(modifyDate)}</span>
        </h5>
        {isMd && !previewMod ? (
          <p className="mb-2 mb-md-3 typo" style={{ fontSize: "14px" }} dangerouslySetInnerHTML={{ __html: renderContent }} />
        ) : (
          <p className="mb-2 mb-md-3">{renderContent}</p>
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

export default PrimaryMessage;
