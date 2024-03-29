// 博客显示的一些工具
import { getClass } from "utils/dom";
import { useAutoShowAndHide } from "hook/useAuto";
import { useAutoScrollTop, useAutoScrollBottom } from "hook/useBlog";
import { BlogMenu } from "./blogMenu";
import { BlogCanvas } from "./blogCanvas";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

export const BlogUtils: SimpleElement = () => {
  const divRef = useAutoShowAndHide<HTMLDivElement>(360);

  const topRef = useAutoScrollTop<HTMLButtonElement>();

  const bottomRef = useAutoScrollBottom<HTMLButtonElement>();

  return (
    <div ref={divRef} className={getClass("btn-group-vertical position-fixed", style.btnPosition)} style={{ display: "none" }}>
      <BlogMenu />
      <button ref={bottomRef} type="button" className="btn btn-info">
        留言
      </button>
      <BlogCanvas />
      <button ref={topRef} type="button" className="btn btn-secondary">
        <i className="ri-arrow-up-s-line" />
      </button>
    </div>
  );
};
