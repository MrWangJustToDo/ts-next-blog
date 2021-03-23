import { getClass } from "utils/class";
import { useBool } from "hook/useData";
import { useLinkToImg } from "hook/useBlog";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

let BlogCanvas: SimpleElement;

BlogCanvas = () => {
  const canvasRef = useLinkToImg<HTMLCanvasElement>();
  const { bool, switchBoolState } = useBool();
  useShowAndHideAnimate<HTMLCanvasElement>({
    key: "blogMenu",
    state: bool,
    forWardRef: canvasRef,
    showClassName: "animate__fadeIn",
    hideClassName: "animate__fadeOut",
  });
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={switchBoolState} data-show={bool}>
        <i className="ri-smartphone-line" />
      </button>
      <canvas ref={canvasRef} className={getClass("position-absolute border rounded", style.canvasContent)} style={{ display: "none" }} />
    </>
  );
};

export default BlogCanvas;
