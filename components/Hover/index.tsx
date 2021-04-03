import React, { useRef } from "react";
import { getClass } from "utils/class";
import { useBool } from "hook/useData";
import Animate from "./animate";
import { HoverType } from "types/components";

let Hover: HoverType;

Hover = ({ className = "", children, hoverItem }) => {
  const key = useRef(String(Date.now()));

  const { bool, showState, hideDebounceNoState } = useBool({ stateChangeTimeStep: 1200, key: key.current });

  return (
    <div onMouseEnter={showState} onMouseLeave={hideDebounceNoState} className={getClass("position-relative", className)}>
      {children}
      <Animate show={bool}>{hoverItem}</Animate>
    </div>
  );
};

export default Hover;
