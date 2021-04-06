import BlogItemLeftUl from "./blogItemLeftUl";
import { flexBetween, getClass } from "utils/class";
import { BlogItemType } from "types/components";

let BlogItemLeft: BlogItemType;

BlogItemLeft = (props) => {
  const { blogTitle, typeContent, blogPreview } = props;
  
  return (
    <div className="col-lg-8">
      <h5 className={getClass("card-title font-weight-bold", flexBetween)}>
        <div>{blogTitle}</div>
        <div className="small">
          <p className="badge badge-info font-weight-normal">{typeContent}</p>
        </div>
      </h5>
      <p className="card-text three-line">{blogPreview}</p>
      <BlogItemLeftUl {...props} />
    </div>
  );
};

export default BlogItemLeft;
