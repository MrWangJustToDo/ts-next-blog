import { useCallback } from "react";
import Link from "next/link";
import { Tag } from "components/Tag";

export const MainRightTagItem = ({ tagName, tagCount, changeCurrentTag }: { tagName: string; tagCount: number; changeCurrentTag: (p: string) => void }) => {
  const clickHandler = useCallback(() => changeCurrentTag(tagName), [changeCurrentTag, tagName]);

  return (
    <Link href="/tag">
      <a className="text-reset d-inline-block text-decoration-none" onClick={clickHandler}>
        <Tag className="small m-1" tagContent={tagName} tagCount={tagCount} />
      </a>
    </Link>
  );
};
