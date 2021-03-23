import { useHome } from "hook/useHome";
import { WithReadBlogItem as MainLeftItem } from "components/BlogItem";
import { SimpleElement } from "types/components";

let MainLeftContent: SimpleElement;

MainLeftContent = () => {
  const { currentPageBlogs } = useHome();
  return (
    <>
      {currentPageBlogs.map((props) => (
        <MainLeftItem key={props.blogId} {...props} />
      ))}
    </>
  );
};

export default MainLeftContent;
