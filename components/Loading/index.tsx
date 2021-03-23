import { flexCenter, getClass } from "utils/class";
import { LoadingType } from "types/components";

import style from "./index.module.scss";

let Loading: LoadingType;

Loading = ({ _style = {}, className = "" }) => {
  return (
    <div className={getClass("container", flexCenter, className)}>
      <div className={style["default"]} style={_style}>
        <div className={style["sk-chase"]}>
          <div className={style["sk-chase-dot"]} />
          <div className={style["sk-chase-dot"]} />
          <div className={style["sk-chase-dot"]} />
          <div className={style["sk-chase-dot"]} />
          <div className={style["sk-chase-dot"]} />
          <div className={style["sk-chase-dot"]} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
