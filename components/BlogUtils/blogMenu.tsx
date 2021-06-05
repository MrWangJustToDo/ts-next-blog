import { getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { useBlogMenu } from "hook/useBlog";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

const BlogMenu: SimpleElement = () => {
  const seted = useBlogMenu(".blog-content");

  const { bool, switchBoolDebounce } = useBool();

  const { animateRef: ref } = useShowAndHideAnimate<HTMLDivElement>({
    state: bool && seted,
    showClassName: "lightSpeedInRight",
    hideClassName: "lightSpeedOutRight",
  });

  return (
    <>
      <button type="button" className="btn btn-info" onClick={switchBoolDebounce}>
        目录
      </button>
      <div ref={ref} className={getClass("position-absolute mb-2 py-1 border rounded", style.menuContent)} style={{ display: "none" }}>
        <ol className="js-toc toc p-0 m-0"></ol>
      </div>
    </>
  );
};

export default BlogMenu;
