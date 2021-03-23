import Link from "next/link";
import { MainRightCommendItemType } from "types/containers";

let MainRightCommendItem: MainRightCommendItemType;

MainRightCommendItem = ({ blogTitle, blogId }) => {
  return (
    <Link href={`/blog/${blogId}`}>
      <a className="list-group-item list-group-item-action small">{blogTitle}</a>
    </Link>
  );
};

export default MainRightCommendItem;
