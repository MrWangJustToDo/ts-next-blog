import { useMemo } from "react";
import { mark } from "utils/markdown";
import { getClass } from "utils/dom";
import { BlogProps } from "types";

import style from "./index.module.scss";

export const BlogContentBody = ({ blogTitle, blogContent }: Pick<BlogProps, "blogTitle" | "blogContent">) => {
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
