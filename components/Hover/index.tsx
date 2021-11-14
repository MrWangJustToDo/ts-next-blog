import React from "react";
import { getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { Animate } from "./animate";
import { HoverType } from "types/components";

export const Hover: HoverType = ({ className = "", children, hoverItem }) => {
  const { bool, boolState, showThrottleState, hideDebounce } = useBool();

  const { animateRef } = useShowAndHideAnimate<HTMLDivElement>({
    state: bool,
    showDone: () => {
      boolState.current = true;
    },
    hideDone: () => {
      boolState.current = true;
    },
  });

  return (
    <div onMouseEnter={showThrottleState} onMouseLeave={hideDebounce} className={getClass("position-relative", className)}>
      {children}
      <Animate forwardRef={animateRef}>{hoverItem}</Animate>
    </div>
  );
};
