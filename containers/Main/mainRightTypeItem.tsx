import Link from "next/link";
import { useCallback } from "react";
import { flexBetween, getClass } from "utils/dom";

export const MainRightTypeItem = ({
  typeName,
  typeCount,
  changeCurrentType,
}: {
  typeName: string;
  typeCount: number;
  changeCurrentType: (t: string) => void;
}) => {
  const clickHandler = useCallback(() => changeCurrentType(typeName), [changeCurrentType, typeName]);

  return (
    <Link href="/type">
      <a className={getClass(flexBetween, "small list-group-item list-group-item-action")} onClick={clickHandler}>
        <span>{typeName}</span>
        <span className="badge badge-info badge-pill">{typeCount}</span>
      </a>
    </Link>
  );
};
