import { FootPage } from "components/PageFoot";
import { useHome } from "hook/useHome";
import { SimpleElement } from "types/components";

export const MainLeftFoot: SimpleElement = () => {
  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage } = useHome();

  return (
    <FootPage
      className="border-0"
      page={currentPage}
      increaseAble={increaseAble}
      decreaseAble={decreaseAble}
      increasePage={increasePage}
      decreasePage={decreasePage}
    />
  );
};
