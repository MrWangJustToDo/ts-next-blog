import { useTag } from "hook/useTag";
import { WithChangeTag as TagItem } from "components/Tag";
import { flexBetween, getClass } from "utils/dom";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

export const TagHead: SimpleElement = () => {
  const { tag, currentTag } = useTag();

  return (
    <div className="card mx-lg-4">
      <h5 className={getClass("card-header text-info user-select-none", flexBetween)}>
        <span className="small">标签</span>
        <div className="text-black-50 small">
          <span>共</span>
          <span className="text-info px-1">{tag.length}</span>
          <span>个</span>
        </div>
      </h5>
      <div className="card-body d-flex flex-wrap">
        {tag.length &&
          tag.map(({ tagId, tagContent, tagCount }) => (
            <div key={tagId} className="m-2">
              <TagItem tagContent={tagContent} tagCount={tagCount} className={getClass("rounded", currentTag === tagContent ? style.tagActive : "")} />
            </div>
          ))}
      </div>
    </div>
  );
};
