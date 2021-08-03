import { useHome } from "hook/useHome";
import { WithReadBlogItem as MainLeftItem } from "components/BlogItem";
import AnimateIist from "components/AnimationList";
import { SimpleElement } from "types/components";

const MainLeftContent: SimpleElement = () => {
  const { currentPageBlogs } = useHome();

  return (
    <AnimateIist showClassName="fadeInUp">
      {currentPageBlogs.map((props) => (
        <MainLeftItem key={props.blogId} {...props} />
      ))}
    </AnimateIist>
  );
};

export default MainLeftContent;
