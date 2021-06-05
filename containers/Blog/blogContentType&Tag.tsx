import { blogOrigin } from "config/publish";
import { flexBetween, getClass } from "utils/dom";
import { BlogContentType } from "types/containers";

const Index: BlogContentType = ({ typeContent, tagContent, blogOriginState }) => {
  return (
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
            tagContent.map((item) => (
              <span key={Math.random()} className="badge m-1 badge-pill badge-info">
                {item}
              </span>
            ))}
        </div>
      </div>
    </li>
  );
};

export default Index;
