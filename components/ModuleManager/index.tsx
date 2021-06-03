import { useMemo } from "react";
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
  const { deskTop, mobile } = useMemo(
    () => ({
      deskTop: overlay && !state,
      mobile: overlay && state,
    }),
    [state, overlay]
  );
  return (
    <>
      <div id="toast" className="position-fixed" style={{ right: "10px", top: "15px", zIndex: 999 }} data-show={toast.length > 0}>
        {toast.map((props) => (
          <Toast key={props.currentTime?.getTime()} {...props} />
        ))}
      </div>
      <ToastPushContext.Provider value={push}>
        <OverlayOpenContext.Provider value={open}>
          <div id="content" style={{ backgroundColor: "#fff" }}>
            {children}
          </div>
        </OverlayOpenContext.Provider>
        <div id="overlay" className="position-fixed h-100 w-100" style={{ left: 0, top: 0, zIndex: 200, pointerEvents: "none" }}>
          <div
            className={getClass("w-100 overflow-auto", flexCenter, style.cover, overlay && overlay.showState ? style.cover_active : "")}
            style={{ height: deskTop ? "100%" : "0", pointerEvents: deskTop ? "auto" : "none" }}
            data-modal="desktop"
            data-show={deskTop}
          >
            {overlay && !state && <DeskTopOverlay {...overlay} />}
          </div>
          <div
            className={getClass("w-100 position-relative", style.cover, overlay && overlay.showState ? style.cover_active : "")}
            style={{ height: mobile ? "100%" : "0", pointerEvents: mobile ? "auto" : "none" }}
            data-modal="mobile"
            data-show={mobile}
          >
            {overlay && state && <MobileOverlay {...overlay} />}
          </div>
        </div>
      </ToastPushContext.Provider>
    </>
  );
};

export default ModuleManager;
