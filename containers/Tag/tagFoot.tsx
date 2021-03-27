import PageFoot from "components/PageFoot";
import { useTag } from "hook/useTag";
import { TagContentType } from "types/containers";

let TagFoot: TagContentType;

TagFoot = ({ blogs }) => {

  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage } = useTag(blogs);
  
  return <PageFoot page={currentPage} increaseAble={increaseAble} decreaseAble={decreaseAble} increasePage={increasePage} decreasePage={decreasePage} />;
};

export default TagFoot;
