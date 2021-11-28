import { Toast } from "components/Toast";
import { DesktopOverlay, MobileOverlay } from "components/Overlay";
import { flexCenter, getClass } from "utils/dom";
import { useMediaQuery } from "hook/useMediaQuery";
import { useToastProps, ToastPushContext } from "hook/useToast";
import { useOverlayProps, OverlayOpenContext, OverlayCloseContext } from "hook/useOverlay";

import style from "./index.module.scss";

export let ModuleManager = ({ children }: { children: JSX.Element }) => {
  const { toast, push } = useToastProps([]);
  const { overlay, open, close } = useOverlayProps();
  const isMobileSize = useMediaQuery("only screen and (max-width: 600px)");
  const showLength = toast.filter((it) => it.showState).length;
  return (
    <>
      <div id="page-toast" data-show={showLength > 0}>
        <div className="position-fixed" style={{ right: "10px", top: "15px", zIndex: 999 }}>
          {toast.map((props) => (
            <Toast key={props.currentTime?.getTime()} {...props} />
          ))}
        </div>
      </div>
      <ToastPushContext.Provider value={push}>
        <OverlayCloseContext.Provider value={close}>
          <OverlayOpenContext.Provider value={open}>
            <div id="page-content" style={{ backgroundColor: "#fff" }}>
              {children}
            </div>
          </OverlayOpenContext.Provider>
          <div id="desktop-overlay" data-modal="desktop" data-show={Boolean(overlay && !isMobileSize)}>
            {!isMobileSize && (
              <div
                className={getClass(
                  "position-fixed w-100 h-100 overflow-auto py-4",
                  flexCenter,
                  style.cover,
                  overlay && overlay.showState ? style.cover_active : ""
                )}
                style={{ pointerEvents: overlay ? "auto" : "none", zIndex: overlay ? 2 : -1 }}
              >
                {overlay && <DesktopOverlay {...overlay} />}
              </div>
            )}
          </div>
          <div id="mobile-overlay" data-modal="mobile" data-show={Boolean(overlay && isMobileSize)}>
            {isMobileSize && (
              <div
                className={getClass("position-fixed w-100 h-100", style.cover, overlay && overlay.showState ? style.cover_active : "")}
                style={{ pointerEvents: overlay ? "auto" : "none", zIndex: overlay ? 2 : -1 }}
              >
                {overlay && <MobileOverlay {...overlay} />}
              </div>
            )}
          </div>
        </OverlayCloseContext.Provider>
      </ToastPushContext.Provider>
    </>
  );
};
