import { useCallback } from "react";
import { useType } from "hook/useType";
import { getClass } from "utils/dom";
import { TypeType } from "types/components";

const Type: TypeType = ({ typeCount, typeContent, className = "", hoverAble = true }) => {
  return (
    <div className={getClass("btn btn-outline-info shadow-none btn-sm m-1", className, hoverAble ? "" : "active")}>
      <span className="mr-2">{typeContent}</span>
      <span className="badge badge-info badge-pill">{typeCount}</span>
    </div>
  );
};

const WithChangeType: TypeType = ({ typeCount, typeContent, className }) => {
  const { changeCurrentType } = useType();

  const changeType = useCallback(() => changeCurrentType(typeContent), []);

  return (
    <div onClick={changeType}>
      <Type {...{ typeContent, typeCount, className }} />
    </div>
  );
};

export { Type, WithChangeType };
