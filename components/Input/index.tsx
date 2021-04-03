import { useEffect } from "react";
import { useJudgeInput } from "hook/useManage";
import { getClass } from "utils/class";
import { InputEleType } from "types/components";

import style from "./index.module.scss";

let Input: InputEleType;

Input = ({
  type,
  name,
  option,
  forWardRef,
  placeHolder,
  changeState,
  judgeApiName,
  outerClassName = "",
  innerClassName = "",
  failClassName,
  successCalsssName,
  loadingClassName,
}) => {
  const [ref, bool] = useJudgeInput({
    option,
    forWardRef,
    judgeApiName,
    successClassName: successCalsssName || style.success,
    failClassName: failClassName || style.fail,
    loadingClassName: loadingClassName || getClass("spinner-border spinner-border-sm text-info", style.loading),
  });

  useEffect(() => {
    if (changeState && typeof changeState === "function") {
      changeState(bool);
    }
  }, [changeState, bool]);
  
  return (
    <div className={getClass("position-relative", outerClassName)}>
      <input ref={ref} className={getClass("form-control", innerClassName)} name={name} type={type || "text"} placeholder={placeHolder} data-check={bool} />
    </div>
  );
};

export default Input;
