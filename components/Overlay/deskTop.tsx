import { useMemo } from "react";
import { useBodyLock } from "hook/useOverlay";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { flexBetween, getClass } from "utils/class";
import { OverlayType } from "types/components";

const Overlay: OverlayType = ({ head, body, foot, closeHandler, showState, className = "" }) => {
  const ref = useShowAndHideAnimate<HTMLDivElement>({
    state: showState || false,
    showClassName: "fadeInDown",
    hideClassName: "fadeOutDown",
  });

  useBodyLock({ ref });

  const bodyContent = useMemo(() => {
    if (typeof body === "function" && closeHandler) {
      return body(closeHandler);
    } else {
      return body;
    }
  }, [body]);

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
