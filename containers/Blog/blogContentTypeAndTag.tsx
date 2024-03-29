import { blogOrigin } from "config/publish";
import { BlogProps, ClientTagProps, TypeProps } from "types";
import { flexBetween, getClass } from "utils/dom";

export const BlogContentTypeAndTag = ({
  typeContent,
  tagContent,
  blogOriginState,
}: {
  typeContent: TypeProps["typeContent"];
  tagContent: ClientTagProps["tagContent"];
  blogOriginState: BlogProps["blogOriginState"];
}) => (
  <li className="list-group-item">
    <div className={getClass("card-body small", flexBetween)}>
      <div className="">
        <span>分类 &gt;</span>
        <span className="text-info pl-2">{typeContent}</span>
        <span className="mx-4 text-primary">|</span>
        <span>来源 &gt;</span>
        <span className="text-info pl-2">{blogOrigin.find((it) => Number(it.value) === blogOriginState)?.name}</span>
      </div>
      <div>
        {tagContent &&
          tagContent.length &&
          tagContent.map((item, i) => (
            <span key={i} className="badge m-1 badge-pill badge-info">
              {item}
            </span>
          ))}
      </div>
    </div>
  </li>
);
