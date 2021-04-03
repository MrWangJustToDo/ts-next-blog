import { getClass } from "utils/class";
import { useAutoSetHeight } from "hook/useAuto";
import { DropContainerType } from "types/components";

import style from "./index.module.scss";

let DropContainer: DropContainerType;

DropContainer = ({ bool, children, length, maxHeight }) => {
  const [ref, height] = useAutoSetHeight<HTMLDivElement>({ deps: [length], maxHeight });
  
  return (
    <div
      ref={ref}
      className={getClass("position-absolute w-100 rounded-bottom", style.dropContainer)}
      style={{ height: bool ? `${height}px` : "0px", overflowY: height === maxHeight ? "scroll" : "hidden" }}
    >
      {children}
    </div>
  );
};

export default DropContainer;
