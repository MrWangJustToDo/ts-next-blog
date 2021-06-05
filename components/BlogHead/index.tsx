import { BlogContentType } from "types/containers";
import { flexBetween, getClass } from "utils/dom";
import BlogHeadLeft from "./blogHeadLeft";
import BlogHeadRight from "./blogHeadRight";

const BlogHead: BlogContentType = (props) => {
  return (
    <h6 className={getClass("card-header bg-transparent", flexBetween)}>
      <BlogHeadLeft {...props} />
      <BlogHeadRight />
    </h6>
  );
};

export default BlogHead;
