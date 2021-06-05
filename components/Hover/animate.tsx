import { AnimateType } from "types/components";
import { getClass } from "utils/dom";

import style from "./index.module.scss";

const Animate: AnimateType = ({ children, forwardRef }) => {
  return (
    <div ref={forwardRef} className={getClass("overflow-hidden", style.animatePanel)} style={{ display: "none" }}>
      {children}
      <div className={getClass("bg-white position-absolute", style.hoverTriangle)} />
      <div className={getClass("w-100", style.hoverHolder)} />
    </div>
  );
};

export default Animate;
