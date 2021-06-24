import { useMemo } from "react";
import Toast from "components/Toast";
import { DeskTopOverlay, MobileOverlay } from "components/Overlay";
import { flexCenter, getClass } from "utils/dom";
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
      <div id="page-toast" className="position-fixed" style={{ right: "10px", top: "15px", zIndex: 999 }} data-show={toast.length > 0}>
        {toast.map((props) => (
          <Toast key={props.currentTime?.getTime()} {...props} />
        ))}
      </div>
      <ToastPushContext.Provider value={push}>
        <OverlayOpenContext.Provider value={open}>
          <div id="page-content" style={{ backgroundColor: "#fff" }}>
            {children}
          </div>
        </OverlayOpenContext.Provider>
        <div
          id="desktop-overlay"
          className={getClass("position-fixed w-100 h-100", flexCenter, style.cover, overlay && overlay.showState ? style.cover_active : "")}
          style={{ pointerEvents: deskTop ? "auto" : "none", zIndex: deskTop ? 2 : -1 }}
          data-modal="desktop"
          data-show={Boolean(deskTop)}
        >
          {overlay && !state && <DeskTopOverlay {...overlay} />}
        </div>
        <div
          id="mobile-overlay"
          className={getClass("position-fixed w-100 h-100", style.cover, overlay && overlay.showState ? style.cover_active : "")}
          style={{ pointerEvents: mobile ? "auto" : "none", zIndex: mobile ? 2 : -1 }}
          data-modal="mobile"
          data-show={Boolean(mobile)}
        >
          {overlay && state && <MobileOverlay {...overlay} />}
        </div>
      </ToastPushContext.Provider>
    </>
  );
};

export default ModuleManager;
