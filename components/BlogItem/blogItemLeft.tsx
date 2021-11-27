import { BlogItemLeftUl } from "./blogItemLeftUl";
import { momentTo } from "utils/time";
import { flexBetween, getClass } from "utils/dom";
import { HomeBlogProps, TypeProps, UserProps } from "types";

export const BlogItemLeft = (props: HomeBlogProps & TypeProps & UserProps) => {
  const { blogTitle, typeContent, blogPreview, blogCreateDate } = props;

  return (
    <div className="col-lg-8 col-sm-7">
      <h5 className={getClass("card-title font-weight-bold", flexBetween)}>
        <div>
          {blogTitle}
          <small className="text-danger" style={{ marginLeft: "1em", fontSize: '0.7rem' }}>
            {momentTo(blogCreateDate)}
          </small>
        </div>
        <div className="small">
          <p className="badge badge-info font-weight-normal">{typeContent}</p>
        </div>
      </h5>
      <p className="card-text three-line">{blogPreview}</p>
      <BlogItemLeftUl {...props} />
    </div>
  );
};
