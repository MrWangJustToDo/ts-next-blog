import { useEffect, useMemo, useState } from "react";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { flexBetween, getClass } from "utils/class";
import { OverlayType } from "types/components";
import { getScrollBarSize } from "utils/action";

const Overlay: OverlayType = ({ head, body, foot, closeHandler, showState, className = "" }) => {
  const [padding, setPadding] = useState<number>(0);

  const ref = useShowAndHideAnimate<HTMLDivElement>({
    state: showState || false,
    showClassName: "fadeInDown",
    hideClassName: "fadeOutDown",
  });

  const bodyContent = useMemo(() => {
    if (typeof body === "function" && closeHandler) {
      return body(closeHandler);
    } else {
      return body;
    }
  }, [body]);

  useEffect(() => {
    if (padding === 0) {
      setPadding(getScrollBarSize());
    }
  }, [padding]);

  useEffect(() => {

    document.body.style.overflowY = "hidden";
    document.body.style.paddingRight = `${padding}px`;
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.paddingRight = `0px`;
    };
  }, [padding]);

  return (
    <div ref={ref} className={getClass("card m-auto user-select-none", className)} style={{ display: "none" }}>
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
