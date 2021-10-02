import { getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { useLinkToImg } from "hook/useBlog";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

const BlogCanvas: SimpleElement = () => {
  const canvasRef = useLinkToImg<HTMLCanvasElement>();

  const { bool, switchBoolDebounce } = useBool();

  useShowAndHideAnimate<HTMLCanvasElement>({
    state: bool,
    forWardRef: canvasRef,
    showClassName: "fadeIn",
    hideClassName: "fadeOut",
  });

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={switchBoolDebounce}>
        <i className="ri-smartphone-line" />
      </button>
      <canvas ref={canvasRef} className={getClass("position-absolute border rounded", style.canvasContent)} />
    </>
  );
};

export default BlogCanvas;
