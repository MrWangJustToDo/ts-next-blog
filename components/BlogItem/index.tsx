import Link from "next/link";
import BlogItemLeft from "./blogItemLeft";
import BlogItemRight from "./blogItemRight";
import { getClass, flexAround } from "utils/dom";
import { BlogItemType } from "types/components";

const BlogItem: BlogItemType = (props) => {
  const { blogImgLink, className = "", _style = {} } = props;

  return (
    <div className={getClass("card-body row flex-wrap-reverse border-bottom px-sm-0 px-lg-2 m-0", flexAround, className)} style={_style}>
      <BlogItemLeft {...props} />
      <BlogItemRight src={blogImgLink!} />
    </div>
  );
};

const WithReadBlogItem: BlogItemType = (props) => {
  return (
    <Link href={`/blog/${props.blogId}`}>
      <a className="text-reset text-decoration-none d-block h-100">
        <BlogItem {...props} />
      </a>
    </Link>
  );
};

const WithWriteBlogItem: BlogItemType = (props) => {
  return (
    <Link href={`/editor/${props.blogId}`}>
      <a className="text-reset text-decoration-none d-block h-100">
        <BlogItem {...props} />
      </a>
    </Link>
  );
};

export { BlogItem, WithReadBlogItem, WithWriteBlogItem };
