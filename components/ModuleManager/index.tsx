import { useMemo } from "react";
import { Toast } from "components/Toast";
import { DesktopOverlay, MobileOverlay } from "components/Overlay";
import { flexCenter, getClass } from "utils/dom";
import { useMediaQuery } from "hook/useMediaQuery";
import { useToastProps, ToastPushContext } from "hook/useToast";
import { useOverlayProps, OverlayOpenContext } from "hook/useOverlay";

import style from "./index.module.scss";

export let ModuleManager = ({ children }: { children: JSX.Element }) => {
  const { toast, push } = useToastProps([]);
  const { overlay, open } = useOverlayProps();
  const state = useMediaQuery("only screen and (max-width: 600px)");
  const { desktop, mobile } = useMemo(
    () => ({
      desktop: overlay && !state,
      mobile: overlay && state,
    }),
    [state, overlay]
  );
  return (
    <>
      <div id="page-toast" data-show={toast.length > 0}>
        <div className="position-fixed" style={{ right: "10px", top: "15px", zIndex: 999 }}>
          {toast.map((props) => (
            <Toast key={props.currentTime?.getTime()} {...props} />
          ))}
        </div>
      </div>
      <ToastPushContext.Provider value={push}>
        <OverlayOpenContext.Provider value={open}>
          <div id="page-content" style={{ backgroundColor: "#fff" }}>
            {children}
          </div>
        </OverlayOpenContext.Provider>
        <div id="desktop-overlay" data-modal="desktop" data-show={Boolean(desktop)}>
          <div
            className={getClass(
              "position-fixed w-100 h-100 overflow-auto py-4",
              flexCenter,
              style.cover,
              overlay && overlay.showState ? style.cover_active : ""
            )}
            style={{ pointerEvents: desktop ? "auto" : "none", zIndex: desktop ? 2 : -1 }}
          >
            {overlay && !state && <DesktopOverlay {...overlay} />}
          </div>
        </div>
        <div id="mobile-overlay" data-modal="mobile" data-show={Boolean(mobile)}>
          <div
            className={getClass("position-fixed w-100 h-100", style.cover, overlay && overlay.showState ? style.cover_active : "")}
            style={{ pointerEvents: mobile ? "auto" : "none", zIndex: mobile ? 2 : -1 }}
          >
            {overlay && state && <MobileOverlay {...overlay} />}
          </div>
        </div>
      </ToastPushContext.Provider>
    </>
  );
};
