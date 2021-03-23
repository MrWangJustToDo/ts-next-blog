import { flexBetween, getClass } from "utils/class";
import { BlogContentType } from "types/containers";

let Index: BlogContentType;

Index = ({ typeContent, tagContent }) => {
  return (
    <li className="list-group-item">
      <div className={getClass("card-body small", flexBetween)}>
        <div className="">
          <span>分类 &gt;</span>
          <span className="text-info pl-2">{typeContent}</span>
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
