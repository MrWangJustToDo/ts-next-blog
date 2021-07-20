import { useCallback, useRef } from "react";
import Loading from "components/Loading";
import { apiName } from "config/api";
import { usePinch } from "hook/usePinch";
import { useAutoLoadRandomImg } from "hook/useAuto";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { actionHandler } from "utils/action";
import { flexCenter, getClass } from "utils/dom";
import { PublishImageModuleType } from "types/containers";

import style from "./index.module.scss";

const PublishImageModule: PublishImageModuleType = ({ closeHandler, initialUrl, inputRef }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const getInitUrl = useCallback(() => inputRef.current?.value, []);

  const [ref, bool] = useAutoLoadRandomImg({ imgUrl: apiName.image, initUrl: initialUrl, getInitUrl });

  useShowAndHideAnimate<HTMLImageElement>({ state: bool, forWardRef: ref });

  const clickCallback = useCallback(() => {
    actionHandler<HTMLInputElement, void, void>(inputRef.current, (input) =>
      actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => (input.value = ele.src))
    );
    closeHandler();
  }, [closeHandler]);

  usePinch({ forWardPinchRef: ref, forWardCoverRef: divRef });

  return (
    <div className="container">
      <div className={getClass(flexCenter)}>
        <div className={getClass("position-relative", style.imgContainer)}>
          <Loading className={getClass("position-absolute", style.imgLoding)} _style={{ display: bool ? "none" : "block" }} />
          <div ref={divRef} className={getClass("w-100 position-absolute", style.imgItem)}>
            <img
              className='border rounded'
              draggable="false"
              ref={ref}
              title="点击切换"
              alt="图片信息"
              width="100%"
              style={{ display: "none" }}
            />
          </div>
        </div>
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
