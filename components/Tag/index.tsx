import { useCallback } from "react";
import { useTag } from "hook/useTag";
import { flexCenter, getClass } from "utils/dom";
import { TagType } from "types/components";

import style from "./index.module.scss";

const Tag: TagType = ({ tagContent, tagCount, className = "", hoverAble = true }) => {
  return (
    <div
      title={tagContent}
      className={getClass(flexCenter, style.tagItem, "border rounded user-select-none d-inline-flex", hoverAble ? style.hoverItem : "", className)}
    >
      <div className={getClass("bg-info", flexCenter, style.tagItem__left)}>
        <i className={getClass("ri-price-tag-line pl-1", style.tagItem__left__icon)} />
        <span className={getClass("px-1", style.tagItem__left__text)}>{tagContent}</span>
      </div>
      <span className={getClass("ml-1 pr-1", style.tagItem__right)}>{tagCount}</span>
    </div>
  );
};

const WithChangeTag: TagType = ({ tagContent, tagCount, className }) => {
  const { changeCurrentTag } = useTag();

  const changeTag = useCallback(() => changeCurrentTag(tagContent), [tagContent]);

  return (
    <div onClick={changeTag}>
      <Tag {...{ tagContent, tagCount, className }} />
    </div>
  );
};

export { Tag, WithChangeTag };
