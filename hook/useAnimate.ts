import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import memoize from "lodash/memoize";
import { log } from "utils/log";
import { delay } from "utils/delay";
import { isServer } from "utils/env";
import { animateCSS } from "utils/dom";
import { actionHandler } from "utils/action";

type animateCallback = () => void | Promise<void>;
interface UseShowAndHideAnimateProps<T> {
  mode?: "display" | "opacity";
  state: boolean;
  faster?: boolean;
  getElement?: () => T | null;
  forWardRef?: RefObject<T>;
  showClassName?: string;
  hideClassName?: string;
  startShow?: animateCallback;
  startHide?: animateCallback;
  showDone?: animateCallback;
  hideDone?: animateCallback;
  deps?: any[];
}
interface UseShowAndHideAnimateReturn<T> {
  animateRef: RefObject<T>;
}
interface UseShowAndHideAnimateType {
  <T extends HTMLElement>(props: UseShowAndHideAnimateProps<T>): UseShowAndHideAnimateReturn<T>;
}

const useShowAndHideAnimate: UseShowAndHideAnimateType = <T extends HTMLElement>({
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
  deps = [],
}: UseShowAndHideAnimateProps<T>) => {
  const ref = useRef<T>(null);
  const currentRef = forWardRef ? forWardRef : ref;
  const callbackRef = useRef({ startHide, startShow, hideDone, showDone });
  callbackRef.current = { startHide, startShow, hideDone, showDone };

  const useUniverseEffect = isServer ? useEffect : useLayoutEffect;

  const getCurrentElement = useCallback(() => {
    let element: T | null = null;
    if (currentRef.current) {
      element = currentRef.current;
    } else if (getElement) {
      element = getElement();
    }
    return element;
  }, [currentRef, getElement]);

  useUniverseEffect(() => {
    const element = getCurrentElement();
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
    const element = getCurrentElement();
    let needCancel = false;
    const { startHide, startShow, hideDone, showDone } = callbackRef.current;
    
    if (!state) {
      // hide
      Promise.resolve(startHide && startHide())
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
        .then(() => delay(0, () => hideDone && hideDone()));
    } else {
      // show
      Promise.resolve(startShow && startShow())
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
        .then(() => delay(0, () => showDone && showDone()));
    }

    return () => {
      needCancel = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, getElement, faster, currentRef, mode, showClassName, hideClassName, ...deps]);
  return { animateRef: currentRef };
};

export { useShowAndHideAnimate };
