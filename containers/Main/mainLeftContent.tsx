import { useHome } from "hook/useHome";
import { WithReadBlogItem as MainLeftItem } from "components/BlogItem";
import { AnimationList } from "components/AnimationList";
import { SimpleElement } from "types/components";

const MainLeftContent: SimpleElement = () => {
  const { currentPageBlogs } = useHome();

  return (
    <AnimationList showClassName="fadeInUp">
      {currentPageBlogs.map((props) => (
        <MainLeftItem key={props.blogId} {...props} />
      ))}
    </AnimationList>
  );
};

export default MainLeftContent;
