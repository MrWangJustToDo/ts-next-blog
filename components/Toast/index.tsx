import { useState } from "react";
import { useAutoActionHandler } from "hook/useAuto";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { momentTo } from "utils/time";
import { flexBetween, flexCenter, getClass } from "utils/class";
import { ToastType } from "types/components";

import style from "./index.module.scss";

const Toast: ToastType = ({ title, currentTime, contentState, content, showState = false, closeHandler, autoCloseSecond = 0 }) => {
  const [currentTimeString, setCurrentTimeString] = useState(momentTo(currentTime || new Date()));

  // 自动关闭
  useAutoActionHandler({ delayTime: autoCloseSecond, action: closeHandler!, timmer: autoCloseSecond > 0, once: true });

  // 自动更新时间显示
  useAutoActionHandler({ delayTime: 60 * 1000, action: () => setCurrentTimeString(momentTo(currentTime || new Date())), timmer: true, once: false });

  // 显示动画
  const ref = useShowAndHideAnimate<HTMLDivElement>({
    state: showState,
    showClassName: "fadeInRight",
    hideClassName: "fadeOutRight",
  });

  return (
    <div ref={ref} className={getClass("toast user-select-none", style.toast)} style={{ display: "none" }}>
      <div className={getClass("toast-header p-md-2", flexBetween)}>
        <div className={getClass("text-info", flexCenter)}>
          <i className="ri-chat-1-fill mr-1" />
          {title}
        </div>
        <div className={getClass(flexCenter)}>
          <small className="text-muted align-bottom">{currentTimeString}</small>
          <button className={getClass("ml-2 close", flexCenter, style.close)} onClick={closeHandler}>
            <i className="ri-close-line small" />
          </button>
        </div>
      </div>
      <div className={getClass("toast-body", contentState || "")}>{content}</div>
    </div>
  );
};

export default Toast;
