import { useEffect } from "react";
import { useJudgeInput } from "hook/useManage";
import { getClass } from "utils/dom";
import { InputEleType } from "types/components";

import style from "./index.module.scss";

export const Input: InputEleType = ({
  type,
  name,
  option,
  forWardRef,
  placeHolder,
  changeState,
  changeLoading,
  judgeApiName,
  autoFocus = false,
  outerClassName = "",
  innerClassName = "",
  failClassName,
  successClassName,
  loadingClassName,
}) => {
  const [ref, state, loading] = useJudgeInput({
    option,
    forWardRef,
    judgeApiName,
    successClassName: successClassName || style.success,
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

  useEffect(() => {
    if (autoFocus) {
      const id = setTimeout(() => {
        ref.current && ref.current.focus();
      }, 200);
      return () => clearTimeout(id);
    }
  }, [autoFocus]);

  return (
    <div className={getClass("position-relative", outerClassName)}>
      <input
        ref={ref}
        name={name}
        data-check={state}
        type={type || "text"}
        autoFocus={autoFocus}
        placeholder={placeHolder}
        className={getClass("form-control", innerClassName)}
      />
    </div>
  );
};
