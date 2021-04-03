import { useCallback } from "react";
import Link from "next/link";
import { Tag } from "components/Tag";
import { MainRightTagItemType } from "types/containers";

let MainRightTagItem: MainRightTagItemType;

MainRightTagItem = ({ tagName, tagCount, changeCurrentTag }) => {
  const clickHandler = useCallback(() => changeCurrentTag(tagName), [tagName]);

  return (
    <Link href="/tag">
      <a className="text-reset d-inline-block text-decoration-none" onClick={clickHandler}>
        <Tag className="small m-1" tagContent={tagName} tagCount={tagCount} />
      </a>
    </Link>
  );
};

export default MainRightTagItem;
