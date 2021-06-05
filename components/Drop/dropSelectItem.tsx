import { MouseEvent, useCallback } from "react";
import { getClass } from "utils/dom";
import { DropSelectItemType } from "types/components";

import style from "./index.module.scss";

const DropSelectItem: DropSelectItemType = ({ idx, name, value, cacel, multiple }) => {
  const cacelCallback = useCallback<(e: MouseEvent) => void>(
    (e) => {
      if (multiple) {
        e.stopPropagation();
        cacel(idx);
      }
    },
    [multiple, idx]
  );

  return (
    <span
      onClick={cacelCallback}
      className={getClass("d-inline-block m-1 rounded border-info", style.drpSelectItem, multiple ? `border ${style.drpSelectItem_cacel}` : "")}
    >
      {name ? name : value}
    </span>
  );
};

export default DropSelectItem;
