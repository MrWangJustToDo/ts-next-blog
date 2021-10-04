import { useEffect, useLayoutEffect, useRef } from "react";
import { log } from "utils/log";
import { delay } from "utils/delay";
import { animateCSS } from "utils/dom";
import { actionHandler } from "utils/action";
import { UseShowAndHideAnimateProps, UseShowAndHideAnimateType } from "types/hook";

const useShowAndHideAnimate: UseShowAndHideAnimateType = <T extends HTMLElement>(
  {
    state,
    forWardRef,
    getElement,
    faster = true,
    mode = "display",
    showClassName = "fadeIn",
    hideClassName = "fadeOut",
    startHide,
    startShow,
    hideDone,
    showDone,
  }: UseShowAndHideAnimateProps<T>,
  ...deps: any[]
) => {
  const ref = useRef<T>(null);
  const currentRef = forWardRef ? forWardRef : ref;
  const callbackRef = useRef({ startHide, startShow, hideDone, showDone });
  callbackRef.current.startHide = startHide;
  callbackRef.current.startShow = startShow;
  callbackRef.current.hideDone = hideDone;
  callbackRef.current.showDone = showDone;

  const isServer = typeof window === "undefined" ? true : false;
  const useUniverseEffect = isServer ? useEffect : useLayoutEffect;

  useUniverseEffect(() => {
    let element: T | null = null;
    if (currentRef.current) {
      element = currentRef.current;
    } else if (getElement) {
      element = getElement();
    }
    actionHandler<T, void>(element, (ele) => {
      if (mode === "display") {
        ele.style.display = "none";
      } else if (mode === "opacity") {
        ele.style.opacity = "0";
      }
    });
  }, [mode, getElement, ...deps]);

  useEffect(() => {
    // init
    let element: T | null = null;
    if (currentRef.current) {
      element = currentRef.current;
    } else if (getElement) {
      element = getElement();
    }
    let needCancel = false;
    const startHideCallback = callbackRef.current.startHide;
    const hideDoneCallback = callbackRef.current.hideDone;
    const startShowCallback = callbackRef.current.startShow;
    const showDoneCallback = callbackRef.current.showDone;
    if (!state) {
      // hide
      Promise.resolve(startHideCallback && startHideCallback())
        .then(() =>
          delay<void>(0, () =>
            actionHandler<T, void | Promise<void>>(element, (ele) => {
              if ((mode === "display" && ele.style.display !== "none") || (mode === "opacity" && ele.style.opacity !== "0")) {
                return animateCSS({ element: ele, from: showClassName, to: hideClassName, faster }).then(() => {
                  if (!needCancel) {
                    if (mode === "display") {
                      ele.style.display = "none";
                    } else {
                      ele.style.opacity = "0";
                    }
                    ele.dataset.show = "false";
                  } else {
                    log("element style change have been cancel", "normal");
                  }
                });
              }
            })
          )
        )
        .then(() => delay(0, () => hideDoneCallback && hideDoneCallback()));
    } else {
      // show
      Promise.resolve(startShowCallback && startShowCallback())
        .then(() =>
          delay<void>(0, () =>
            actionHandler<T, void>(element, (ele) => {
              ele.dataset.show = "true";
              if (mode === "display") {
                if (ele.style.display === "none") {
                  ele.style.display = "block";
                }
              } else if (mode === "opacity") {
                if (ele.style.opacity === "0") {
                  ele.style.opacity = "1";
                }
              }
            })
          )
        )
        .then(() => actionHandler<T, Promise<void>>(element, (ele) => animateCSS({ element: ele, from: hideClassName, to: showClassName, faster })))
        .then(() => delay(0, () => showDoneCallback && showDoneCallback()));
    }

    return () => {
      needCancel = true;
    };
  }, [state, getElement, faster, ...deps]);
  return { animateRef: currentRef };
};

export { useShowAndHideAnimate };
