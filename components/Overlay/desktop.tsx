import { useRef } from "react";
import { useBodyLock, useOverlayBody } from "hook/useOverlay";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { flexBetween, getClass } from "utils/dom";
import { OverlayType } from "types/components";
import { getScrollBarSize } from "utils/action";

const Overlay: OverlayType = ({ head, body, foot, closeHandler, showState, className = "", clear }) => {
  const scrollBarWidth = useRef(0);

  const { animateRef: ref } = useShowAndHideAnimate<HTMLDivElement>({
    state: showState || false,
    showClassName: "fadeInDown",
    hideClassName: "fadeOutDown",
    startShow: () => {
      if (!scrollBarWidth.current) {
        scrollBarWidth.current = getScrollBarSize();
      }
      document.body.style.paddingRight = `${scrollBarWidth.current}px`;
    },
    hideDone: () => {
      document.body.style.paddingRight = "0px";
      clear && clear();
    },
  });

  useBodyLock({ ref });

  const bodyContent = useOverlayBody({ body, closeHandler });

  return (
    <div ref={ref} className={getClass("card m-auto user-select-none", className)}>
      <div className={getClass("card-header", flexBetween)}>
        {head}
        <button className="close" style={{ outline: "none" }} onClick={closeHandler}>
          <i className="ri-close-line small ml-4" />
        </button>
      </div>
      <div className="card-body">{bodyContent}</div>
      {foot && <div className="card-footer">{foot}</div>}
    </div>
  );
};

export default Overlay;
