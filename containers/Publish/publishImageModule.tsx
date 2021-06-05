import { useCallback } from "react";
import Loading from "components/Loading";
import { useAutoLoadRandomImg } from "hook/useAuto";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import { actionHandler } from "utils/action";
import { PublishImageModuleType } from "types/containers";

import style from "./index.module.scss";

const PublishImageModule: PublishImageModuleType = ({ closeHandler, appendHandler, inputRef }) => {
  const [ref, bool] = useAutoLoadRandomImg({ imgUrl: apiName.image, initUrl: inputRef.current?.value });

  useShowAndHideAnimate<HTMLImageElement>({ state: bool, forWardRef: ref });

  const clickCallback = useCallback(() => {
    actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => appendHandler(ele.src));
    closeHandler();
  }, [closeHandler]);

  return (
    <div className="container">
      <div className={getClass("position-relative", style.imgContainer)}>
        <Loading className={getClass("position-absolute", style.imgLoding)} _style={{ display: bool ? "none" : "block" }} />
        <img
          className={getClass("position-absolute border rounded", style.imgItem)}
          ref={ref}
          title="点击切换"
          alt="图片信息"
          width="400"
          style={{ display: "none" }}
        />
      </div>
      <div className="form-row my-3 flex-row-reverse">
        <button className="btn btn-secondary btn-sm mx-2" type="button" onClick={clickCallback}>
          确定
        </button>
      </div>
    </div>
  );
};

export default PublishImageModule;
