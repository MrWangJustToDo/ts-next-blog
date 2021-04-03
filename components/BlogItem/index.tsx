import Link from "next/link";
import BlogItemLeft from "./blogItemLeft";
import BlogItemRight from "./blogItemRight";
import { getClass, flexAround } from "utils/class";
import { BlogItemType } from "types/components";

import style from "./index.module.scss";

let BlogItem: BlogItemType;

let WithReadBlogItem: BlogItemType;

let WithWriteBlogItem: BlogItemType;

BlogItem = (props) => {
  const { blogImgLink, className = "", _style = {} } = props;
  
  return (
    <div className={getClass("card-body row flex-wrap-reverse border-bottom", flexAround, style.blogItem, className)} style={_style}>
      <BlogItemLeft {...props} />
      <BlogItemRight src={blogImgLink!} />
    </div>
  );
};

WithReadBlogItem = (props) => {
  return (
    <Link href={`/blog/${props.blogId}`}>
      <a className="text-reset text-decoration-none d-block h-100">
        <BlogItem {...props} />
      </a>
    </Link>
  );
};

WithWriteBlogItem = (props) => {
  return (
    <Link href={`/editor/${props.blogId}`}>
      <a className="text-reset text-decoration-none d-block h-100">
        <BlogItem {...props} />
      </a>
    </Link>
  );
};

export { BlogItem, WithReadBlogItem, WithWriteBlogItem };
