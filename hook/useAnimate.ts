import { useEffect, useRef } from "react";
import { log } from "utils/log";
import { delay } from "utils/delay";
import { animateCSS } from "utils/dom";
import { actionHandler } from "utils/action";
import { UseShowAndHideAnimateProps, UseShowAndHideAnimateType } from "types/hook";

const useShowAndHideAnimate: UseShowAndHideAnimateType = <T extends HTMLElement>({
  state,
  forWardRef,
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
    actionHandler<T, void, void>(currentRef.current, (ele) =>
      ele.classList.remove("animate__animated", `animate__${showClassName}`, `animate__${hideClassName}`)
    );
    let needCacel = false;
    const startHideCallback = callbackRef.current.startHide;
    const hideDoneCallback = callbackRef.current.hideDone;
    const startShowCallback = callbackRef.current.startShow;
    const showDoneCallback = callbackRef.current.showDone;
    if (!state) {
      // hide
      Promise.resolve(() => startHideCallback && startHideCallback())
        .then(() =>
          delay<void>(0, () =>
            actionHandler<T, void | Promise<void>, Promise<void>>(currentRef.current, (ele) => {
              if (ele.style.display !== "none") {
                return animateCSS({ element: ele, animation: hideClassName }).then(() =>
                  actionHandler<T, void, void>(currentRef.current, (ele) => {
                    if (!needCacel) {
                      ele.style.display = "none";
                      ele.dataset.show = "false";
                    } else {
                      log("element style change have been cacel", "normal");
                    }
                  })
                );
              } else {
                log("aleardy hide, do not need animate", "normal");
              }
            })
          )
        )
        .then(() => delay(0, () => hideDoneCallback && hideDoneCallback()));
    } else {
      // show
      Promise.resolve(() => startShowCallback && startShowCallback())
        .then(() =>
          delay<void>(0, () =>
            actionHandler<T, void, void>(currentRef.current, (ele) => {
              ele.style.display = "block";
              ele.dataset.show = "true";
            })
          )
        )
        .then(() => actionHandler<T, Promise<void>, Promise<void>>(currentRef.current, (ele) => animateCSS({ element: ele, animation: showClassName })))
        .then(() => delay(0, () => showDoneCallback && showDoneCallback()));
    }

    return () => {
      needCacel = true;
    };
  }, [state]);
  return { animateRef: currentRef };
};

export { useShowAndHideAnimate };
