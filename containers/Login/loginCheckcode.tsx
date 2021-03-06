import { apiName } from "config/api";
import { useAutoLoadCheckcodeImg, useAutoSetHeight } from "hook/useAuto";
import { flexBetween, getClass } from "utils/dom";
import { LoginCheckCodeType } from "types/containers";

import style from "./index.module.scss";

const LoginCheckCode: LoginCheckCodeType = ({ show }) => {
  const [ref, height] = useAutoSetHeight<HTMLDivElement>();

  const imgRef = useAutoLoadCheckcodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr, state: show });

  return (
    <div ref={ref} className={getClass("form-group row align-items-center overflow-hidden", style.checkcode)} style={{ height: show ? `${height}px` : "0px" }}>
      <label htmlFor="checkcode" className="col-sm-3 col-form-label">
        验证码:
      </label>
      <div className={getClass("col-sm-9 px-0 mx-0 flex-wrap flex-md-nowrap", flexBetween)}>
        <img className="col-sm-4 border rounded my-2 my-md-0" height="40" ref={imgRef} />
        <input type="text" className="form-control shadow-none col-sm-7 rounded" name="checkCode" id="checkcode" />
      </div>
    </div>
  );
};

export default LoginCheckCode;
