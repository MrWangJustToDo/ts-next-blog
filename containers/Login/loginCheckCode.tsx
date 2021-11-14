import { apiName } from "config/api";
import { AnimationItem } from "components/AnimationList";
import { useAutoLoadCheckCodeImg, useAutoSetHeight } from "hook/useAuto";
import { clearImg } from "utils/image";
import { actionHandler } from "utils/action";
import { flexBetween, getClass } from "utils/dom";

import style from "./index.module.scss";

export const LoginCheckCode = ({ show }: { show: boolean }) => {
  const [ref, height] = useAutoSetHeight<HTMLDivElement>();

  const imgRef = useAutoLoadCheckCodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr, state: show });

  return (
    <AnimationItem showState={show} hideDone={() => actionHandler<HTMLImageElement, void>(imgRef.current, (ele) => clearImg(ele))}>
      <div
        ref={ref}
        className={getClass("form-group row align-items-center overflow-hidden", style.checkCode)}
        style={{ height: show ? `${height}px` : "0px" }}
      >
        <label htmlFor="checkCode" className="col-sm-3 col-form-label">
          验证码:
        </label>
        <div className={getClass("col-sm-9 px-0 mx-0 flex-wrap flex-md-nowrap", flexBetween)}>
          <img className="col-sm-4 border rounded my-2 my-md-0" height="40" ref={imgRef} />
          <input type="text" className="form-control shadow-none col-sm-7 rounded" name="checkCode" id="checkCode" />
        </div>
      </div>
    </AnimationItem>
  );
};
