import Toast from "components/Toast";
import { DeskTopOverlay, MobileOverlay } from "components/Overlay";
import { flexCenter, getClass } from "utils/class";
import { useMediaQuery } from "hook/useMediaQuery";
import { useToastProps, ToastPushContext } from "hook/useToast";
import { useOverlayProps, OverlayOpenContext } from "hook/useOverlay";

import style from "./index.module.scss";

let ModuleManager = ({ children }: { children: JSX.Element }) => {
  const { toast, push } = useToastProps([]);
  const { overlay, open } = useOverlayProps();
  const state = useMediaQuery("only screen and (max-width: 600px)");
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
            className={getClass(
              "w-100 overflow-auto py-5",
              !state ? "h-100" : "h-0",
              flexCenter,
              style.cover,
              overlay && overlay.showState ? style.cover_active : ""
            )}
            style={{ pointerEvents: overlay && overlay.showState && !state ? "auto" : "none" }}
            data-modal="desktop"
            data-show={!!overlay && !state}
          >
            {overlay && !state && <DeskTopOverlay {...overlay} />}
          </div>
          <div
            className={getClass("w-100 position-relative", state ? "h-100" : "h-0", style.cover, overlay && overlay.showState ? style.cover_active : "")}
            style={{ pointerEvents: overlay && overlay.showState && state ? "auto" : "none" }}
            data-modal="mobile"
            data-show={!!overlay && state}
          >
            {overlay && state && <MobileOverlay {...overlay} />}
          </div>
        </div>
      </ToastPushContext.Provider>
    </>
  );
};

export default ModuleManager;
