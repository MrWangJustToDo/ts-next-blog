import { FootPage } from "components/PageFoot";
import { useTag } from "hook/useTag";
import { HomeProps } from "store/reducer/server/action/home";

export const TagFoot = ({ blogs }: { blogs: HomeProps }) => {
  let { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageBlogs } = useTag({ blogs });

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
