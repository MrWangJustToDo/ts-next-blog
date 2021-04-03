import Link from "next/link";
import { useCallback } from "react";
import { flexBetween, getClass } from "utils/class";
import { MainRightTypeItemType } from "types/containers";

let MainRightTypeItem: MainRightTypeItemType;

MainRightTypeItem = ({ typeName, typeCount, changeCurrentType }) => {
  const clickHandler = useCallback(() => changeCurrentType(typeName), [typeName]);

  return (
    <Link href="/type">
      <a className={getClass(flexBetween, "small list-group-item list-group-item-action")} onClick={clickHandler}>
        <span>{typeName}</span>
        <span className="badge badge-info badge-pill">{typeCount}</span>
      </a>
    </Link>
  );
};

export default MainRightTypeItem;
