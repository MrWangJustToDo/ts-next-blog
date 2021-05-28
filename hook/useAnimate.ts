import { useEffect, useRef } from "react";
import { delay } from "utils/delay";
import { animateCSS } from "utils/class";
import { actionHandler } from "utils/action";
import { UseShowAndHideAnimateProps, UseShowAndHideAnimateType } from "types/hook";

let useShowAndHideAnimate: UseShowAndHideAnimateType;

useShowAndHideAnimate = <T extends HTMLElement>({ state, forWardRef, showClassName = "fadeIn", hideClassName = "fadeOut" }: UseShowAndHideAnimateProps<T>) => {
  const ref = useRef<T>(null);
  const currentRef = forWardRef ? forWardRef : ref;
  useEffect(() => {
    // init
    actionHandler<T, void, void>(currentRef.current, (ele) =>
      ele.classList.remove("animate__animated", `animate__${showClassName}`, `animate__${hideClassName}`)
    );
    let needCacel = false;
    if (!state) {
      // hide
      actionHandler<T, void, Promise<void>>(currentRef.current, (ele) => {
        if (ele.style.display !== "none") {
          return animateCSS({ element: ele, animation: hideClassName }).then(() =>
            actionHandler<T, void, void>(currentRef.current, (ele) => {
              if (!needCacel) {
                ele.style.display = "none";
                ele.dataset.show = "false";
              }
            })
          );
        }
      });
    } else {
      // show
      delay<void>(0, () =>
        actionHandler<T, void, void>(currentRef.current, (ele) => {
          ele.style.display = "block";
          ele.dataset.show = "true";
        })
      ).then(() => actionHandler<T, Promise<void>, Promise<void>>(currentRef.current, (ele) => animateCSS({ element: ele, animation: showClassName })));
    }

    return () => {
      needCacel = true;
    };
  }, [state]);
  return currentRef;
};

export { useShowAndHideAnimate };
