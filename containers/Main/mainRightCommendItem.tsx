import Link from "next/link";
import { HomeBlogProps } from "types";

export const MainRightCommendItem = ({ blogTitle, blogId }: Pick<HomeBlogProps, "blogTitle" | "blogId">) => {
  return (
    <Link href={`/blog/${blogId}`}>
      <a className="list-group-item list-group-item-action small">{blogTitle}</a>
    </Link>
  );
};
