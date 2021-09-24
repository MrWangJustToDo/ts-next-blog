import { useEffect, useRef } from "react";
import { log } from "utils/log";
import { delay } from "utils/delay";
import { animateCSS } from "utils/dom";
import { actionHandler } from "utils/action";
import { UseShowAndHideAnimateProps, UseShowAndHideAnimateType } from "types/hook";

const useShowAndHideAnimate: UseShowAndHideAnimateType = <T extends HTMLElement>({
  state,
  forWardRef,
  getElement,
  mode = "display",
  showClassName = "fadeIn",
  hideClassName = "fadeOut",
  startHide,
  startShow,
  hideDone,
  showDone,
}: UseShowAndHideAnimateProps<T>) => {
  const ref = useRef<T>(null);
  const currentRef = forWardRef ? forWardRef : ref;
  const callbackRef = useRef({ startHide, startShow, hideDone, showDone });
  callbackRef.current.startHide = startHide;
  callbackRef.current.startShow = startShow;
  callbackRef.current.hideDone = hideDone;
  callbackRef.current.showDone = showDone;
  useEffect(() => {
    // init
    let element: T | null = null;
    if (currentRef.current) {
      element = currentRef.current;
    } else if (getElement) {
      element = getElement();
    }
    actionHandler<T, void, void>(element, (ele) => {
      ele.classList.remove("animate__animated", `animate__${showClassName}`, `animate__${hideClassName}`);
    });
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
            actionHandler<T, void | Promise<void>, Promise<void>>(element, (ele) => {
              if ((mode === "display" && ele.style.display !== "none") || (mode === "opacity" && ele.style.opacity !== "0")) {
                return animateCSS({ element: ele, animation: hideClassName }).then(() => {
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
            actionHandler<T, void, void>(element, (ele) => {
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
        .then(() => actionHandler<T, Promise<void>, Promise<void>>(element, (ele) => animateCSS({ element: ele, animation: showClassName })))
        .then(() => delay(0, () => showDoneCallback && showDoneCallback()));
    }

    return () => {
      needCancel = true;
    };
  }, [state]);
  return { animateRef: currentRef };
};

export { useShowAndHideAnimate };
