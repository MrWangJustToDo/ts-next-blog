import { useHome } from "hook/useHome";
import { WithReadBlogItem as MainLeftItem } from "components/BlogItem";
import AnimateList from "components/AnimationList";
import { SimpleElement } from "types/components";

const MainLeftContent: SimpleElement = () => {
  const { currentPageBlogs } = useHome();

  return (
    <AnimateList showClassName="fadeInUp">
      {currentPageBlogs.map((props) => (
        <MainLeftItem key={props.blogId} {...props} />
      ))}
    </AnimateList>
  );
};

export default MainLeftContent;
