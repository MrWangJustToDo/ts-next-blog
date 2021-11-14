import { AnimateType } from "types/components";
import { getClass } from "utils/dom";

import style from "./index.module.scss";

export const Animate: AnimateType = ({ children, forwardRef }) => {
  return (
    <div data-panel="hover" ref={forwardRef} className={getClass("overflow-hidden", style.animatePanel)}>
      {children}
      <div className={getClass("bg-white position-absolute", style.hoverTriangle)} />
      <div className={getClass("w-100", style.hoverHolder)} />
    </div>
  );
};
