import { useEffect, useMemo } from "react";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { flexBetween, getClass } from "utils/class";
import { OverlayType } from "types/components";

let Overlay: OverlayType;

Overlay = ({ head, body, foot, closeHandler, showState, className = "" }) => {
  const ref = useShowAndHideAnimate<HTMLDivElement>({
    state: showState || false,
    key: "overlay",
    showClassName: "animate__fadeInDown",
    hideClassName: "animate__fadeOutDown",
  });

  const bodyContent = useMemo(() => {
    if (typeof body === "function" && closeHandler) {
      return body(closeHandler);
    } else {
      return body;
    }
  }, [body]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden", "mr-3");
    return () => document.body.classList.remove("overflow-hidden", "mr-3");
  }, []);

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
