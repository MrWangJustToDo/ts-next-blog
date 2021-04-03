import { useShowAndHideAnimate } from "hook/useAnimate";
import { AnimateType } from "types/components";
import { getClass } from "utils/class";

import style from "./index.module.scss";

let Animate: AnimateType;

Animate = ({ children, show }) => {
  const ref = useShowAndHideAnimate<HTMLDivElement>({ state: show });
  
  return (
    <div ref={ref} className={getClass("overflow-hidden", style.animatePanel)} style={{ display: "none" }}>
      {children}
      <div className={getClass("bg-white position-absolute", style.hoverTriangle)} />
      <div className={getClass("w-100", style.hoverHolder)} />
    </div>
  );
};

export default Animate;
