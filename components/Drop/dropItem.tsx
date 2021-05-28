import { useCallback } from "react";
import { getClass } from "utils/class";
import { DropItemType } from "types/components";

import style from "./index.module.scss";

const DropItem: DropItemType = ({ clickHandler, value, name, index, checkedIndex }) => {
  const clickCallback = useCallback(() => clickHandler!(index!), [clickHandler, index]);

  return (
    <div
      className={getClass("text-center p-2 m-1 rounded small", style.dropItem, checkedIndex!.includes(index!) ? style.dropItem_checked : "")}
      onClick={clickCallback}
    >
      {name ? name : value}
    </div>
  );
};

export default DropItem;
