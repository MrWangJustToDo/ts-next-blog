import { flexCenter, getClass } from "utils/dom";
import { LoadingType } from "types/components";

import style from "./index.module.scss";

export const Loading: LoadingType = ({ _style = {}, className = "", color = "info" }) => {
  return (
    <div className={getClass("", flexCenter, className)}>
      <div className={style["default"]} style={_style}>
        <div className={style["sk-chase"]}>
          <div className={getClass(style["sk-chase-dot"], style[color])} />
          <div className={getClass(style["sk-chase-dot"], style[color])} />
          <div className={getClass(style["sk-chase-dot"], style[color])} />
          <div className={getClass(style["sk-chase-dot"], style[color])} />
          <div className={getClass(style["sk-chase-dot"], style[color])} />
          <div className={getClass(style["sk-chase-dot"], style[color])} />
        </div>
      </div>
    </div>
  );
};
