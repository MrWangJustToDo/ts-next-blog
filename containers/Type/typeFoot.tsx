import PageFoot from "components/PageFoot";
import useType from "hook/useType";
import { TypeContentType } from "types/containers";

let TypeFoot: TypeContentType;

TypeFoot = ({ blogs }) => {

  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage } = useType(blogs);
  
  return <PageFoot page={currentPage} increaseAble={increaseAble} decreaseAble={decreaseAble} increasePage={increasePage} decreasePage={decreasePage} />;
};

export default TypeFoot;
