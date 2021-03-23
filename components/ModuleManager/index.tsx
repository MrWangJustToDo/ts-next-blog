import Toast from "components/Toast";
import Replay from "components/Overlay";
import { flexCenter, getClass } from "utils/class";
import { useToastProps, ToastPushContext } from "hook/useToast";
import { useOverlayProps, OverlayOpenContext } from "hook/useOverlay";

import style from "./index.module.scss";

let ModuleManager = ({ children }: { children: JSX.Element }) => {
  const { toast, push } = useToastProps([]);
  const { overlay, open } = useOverlayProps();
  return (
    <>
      <div className="position-fixed" style={{ right: "10px", top: "15px", zIndex: 999 }} data-show={toast.length > 0}>
        {toast.map((props) => (
          <Toast key={props.currentTime?.getTime()} {...props} />
        ))}
      </div>
      <ToastPushContext.Provider value={push}>
        <OverlayOpenContext.Provider value={open}>{children}</OverlayOpenContext.Provider>
        <div className="position-fixed h-100 w-100" style={{ left: 0, top: 0, zIndex: 200, pointerEvents: "none" }}>
          <div
            className={getClass("w-100 h-100 overflow-auto py-5", flexCenter, style.cover, overlay && overlay.showState ? style.cover_active : "")}
            style={{ pointerEvents: overlay && overlay.showState ? "auto" : "none" }}
            data-show={!!overlay}
          >
            {overlay && <Replay {...overlay} />}
          </div>
        </div>
      </ToastPushContext.Provider>
    </>
  );
};

export default ModuleManager;
