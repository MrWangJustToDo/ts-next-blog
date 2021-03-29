import PageFoot from "components/PageFoot";
import { useTag } from "hook/useTag";
import { TagContentType } from "types/containers";

let TagFoot: TagContentType;

TagFoot = ({ blogs }) => {
  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageBlogs } = useTag(blogs);

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

export default TagFoot;
