import { FootPage } from "components/PageFoot";
import { useType } from "hook/useType";
import { HomeProps } from "store/reducer/server/action/home";

export const TypeFoot = ({ blogs }: { blogs: HomeProps }) => {
  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageBlogs } = useType({ blogs });

  return currentPageBlogs.length ? (
    <FootPage
      className="border-0"
      page={currentPage}
      increaseAble={increaseAble}
      decreaseAble={decreaseAble}
      increasePage={increasePage}
      decreasePage={decreasePage}
    />
  ) : null;
};
