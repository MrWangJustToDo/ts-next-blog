import { flexCenter, getClass } from "utils/class";
import { LoadingType } from "types/components";

import style from "./index.module.scss";

let Loading: LoadingType;

Loading = ({ _style = {}, className = "", color = "#17a2b8" }) => {
  return (
    <div className={getClass("", flexCenter, className)}>
      <div className={style["default"]} style={_style}>
        <div className={style["sk-chase"]}>
          {/* <div data-name="color" style={{ visibility: 'hidden', backgroundColor: color }}> */}
            <div className={style["sk-chase-dot"]} />
            <div className={style["sk-chase-dot"]} />
            <div className={style["sk-chase-dot"]} />
            <div className={style["sk-chase-dot"]} />
            <div className={style["sk-chase-dot"]} />
            <div className={style["sk-chase-dot"]} />
          </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Loading;
