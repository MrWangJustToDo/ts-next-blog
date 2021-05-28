import { useBool } from "hook/useData";
import { getClass } from "utils/class";
import { CheckBoxType } from "types/components";

import styleCss from "./index.module.scss";

const CheckBox: CheckBoxType = ({ fieldName, style, type = "radio", init, className = "" }) => {
  const { bool, switchBoolState } = useBool({ init });
  
  return (
    <div className={getClass(className)} style={style}>
      <div className={getClass(styleCss.checkbox, bool ? styleCss.checked : "")} onClick={switchBoolState} />
      <input name={fieldName} type={type} style={{ display: "none" }} checked={bool} readOnly />
    </div>
  );
};

export default CheckBox;
