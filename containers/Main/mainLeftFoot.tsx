import PageFoot from "components/PageFoot";
import { useHome } from "hook/useHome";
import { SimpleElement } from "types/components";

const MainLeftFoot: SimpleElement = () => {
  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage } = useHome();

  return (
    <PageFoot
      className="border-0"
      page={currentPage}
      increaseAble={increaseAble}
      decreaseAble={decreaseAble}
      increasePage={increasePage}
      decreasePage={decreasePage}
    />
  );
};

export default MainLeftFoot;
