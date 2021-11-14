import Link from "next/link";
import { SimpleElement } from "types/components";

export const BlogHeadRight: SimpleElement = () => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="bg-transparent small breadcrumb m-0">
        <li className="breadcrumb-item text-info">
          <Link href="/">
            <a className="text-reset text-decoration-none">所有博客</a>
          </Link>
        </li>
        <li className="breadcrumb-item active">正文</li>
      </ol>
    </nav>
  );
};
