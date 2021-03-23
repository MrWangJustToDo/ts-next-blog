import { BlogContentType } from "types/containers";
import { flexBetween, getClass } from "utils/class";
import BlogHeadLeft from "./blogHeadLeft";
import BlogHeadRight from "./blogHeadRight";

let BlogHead: BlogContentType;

BlogHead = (props) => {
  return (
    <h6 className={getClass("card-header bg-transparent", flexBetween)}>
      <BlogHeadLeft {...props} />
      <BlogHeadRight />
    </h6>
  );
};

export default BlogHead;
