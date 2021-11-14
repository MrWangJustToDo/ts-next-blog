import { RefObject, useCallback, useRef } from "react";
import { Loading } from "components/Loading";
import { apiName } from "config/api";
import { usePinch } from "hook/usePinch";
import { useAutoLoadRandomImg } from "hook/useAuto";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { actionHandler } from "utils/action";
import { flexCenter, getClass } from "utils/dom";

import style from "./index.module.scss";

export const PublishImageModule = ({
  closeHandler,
  initialUrl,
  inputRef,
}: {
  closeHandler: () => void;
  initialUrl?: string;
  inputRef: RefObject<HTMLInputElement>;
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const getInitUrl = useCallback(() => inputRef.current?.value, [inputRef]);

  const [ref, bool] = useAutoLoadRandomImg({ imgUrl: apiName.image, initUrl: initialUrl, getInitUrl });

  useShowAndHideAnimate<HTMLImageElement>({ state: bool, forWardRef: ref });

  const clickCallback = useCallback(() => {
    actionHandler<HTMLInputElement, void>(inputRef.current, (input) => actionHandler<HTMLImageElement, void>(ref.current, (ele) => (input.value = ele.src)));
    closeHandler();
  }, [closeHandler, inputRef, ref]);

  usePinch({ forWardPinchRef: ref, forWardCoverRef: divRef });

  return (
    <div className="container">
      <div className={getClass(flexCenter)}>
        <div className={getClass("position-relative", style.imgContainer)}>
          <Loading className={getClass("position-absolute", style.imgLoading)} _style={{ display: bool ? "none" : "block" }} />
          <div ref={divRef} className={getClass("w-100 position-absolute", style.imgItem)}>
            <img className="border rounded" draggable="false" ref={ref} title="点击切换" alt="图片信息" width="100%" />
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
