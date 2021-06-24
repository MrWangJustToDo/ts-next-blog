import { useEffect } from "react";
import { useJudgeInput } from "hook/useManage";
import { getClass } from "utils/dom";
import { InputEleType } from "types/components";

import style from "./index.module.scss";

const Input: InputEleType = ({
  type,
  name,
  option,
  forWardRef,
  placeHolder,
  changeState,
  changeLoading,
  judgeApiName,
  outerClassName = "",
  innerClassName = "",
  failClassName,
  successCalsssName,
  loadingClassName,
}) => {
  const [ref, state, loading] = useJudgeInput({
    option,
    forWardRef,
    judgeApiName,
    successClassName: successCalsssName || style.success,
    failClassName: failClassName || style.fail,
    loadingClassName: loadingClassName || getClass("spinner-border spinner-border-sm text-info", style.loading),
  });

  useEffect(() => {
    if (changeState) {
      changeState(state);
    }
  }, [changeState, state]);

  useEffect(() => {
    if (changeLoading) {
      changeLoading(loading);
    }
  }, [changeLoading, loading]);

  return (
    <div className={getClass("position-relative", outerClassName)}>
      <input ref={ref} className={getClass("form-control", innerClassName)} name={name} type={type || "text"} placeholder={placeHolder} data-check={state} />
    </div>
  );
};

export default Input;
