import PageFoot from "components/PageFoot";
import useType from "hook/useType";
import { TypeContentType } from "types/containers";

let TypeFoot: TypeContentType;

TypeFoot = ({ blogs }) => {
  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageBlogs } = useType(blogs);

  return currentPageBlogs.length ? (
    <PageFoot
      className="border-0"
      page={currentPage}
      increaseAble={increaseAble}
      decreaseAble={decreaseAble}
      increasePage={increasePage}
      decreasePage={decreasePage}
    />
  ) : null;
};

export default TypeFoot;
