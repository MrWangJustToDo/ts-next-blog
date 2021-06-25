import { useMemo } from "react";
import { mark } from "utils/markdown";
import { getClass } from "utils/dom";
import { BlogContentType } from "types/containers";

import style from "./index.module.scss";

const BlogContentBody: BlogContentType = ({ blogTitle, blogContent }) => {
  const html = useMemo(() => mark.render(blogContent || ""), [blogContent]);
  return (
    <li className="list-group-item">
      <div className="card-body typo">
        <h1 className="font-weight-bold text-center">{blogTitle}</h1>
        <br />
        <div className={getClass(style.blogContent, "blog-content")} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </li>
  );
};

export default BlogContentBody;
