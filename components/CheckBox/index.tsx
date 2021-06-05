import { useBool } from "hook/useData";
import { getClass } from "utils/dom";
import { CheckBoxType } from "types/components";

import style from "./index.module.scss";

const CheckBox: CheckBoxType = ({ fieldName, _style, type = "radio", init, className = "" }) => {
  const { bool, switchBoolDebounce } = useBool({ init });

  return (
    <div className={getClass(className)} style={_style}>
      <div className={getClass(style.checkbox, bool ? style.checked : "")} onClick={switchBoolDebounce} />
      <input name={fieldName} type={type} style={{ display: "none" }} checked={bool} readOnly />
    </div>
  );
};

export default CheckBox;
