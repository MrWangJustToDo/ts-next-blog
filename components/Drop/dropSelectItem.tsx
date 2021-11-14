import { MouseEvent, useCallback } from "react";
import { getClass } from "utils/dom";
import { DropSelectItemType } from "types/components";

import style from "./index.module.scss";

export const DropSelectItem: DropSelectItemType = ({ idx, name, value, cancel, multiple }) => {
  const cancelCallback = useCallback<(e: MouseEvent) => void>(
    (e) => {
      if (multiple) {
        e.stopPropagation();
        cancel(idx);
      }
    },
    [multiple, cancel, idx]
  );

  return (
    <span
      onClick={cancelCallback}
      className={getClass("d-inline-block m-1 rounded border-info", style.drpSelectItem, multiple ? `border ${style.drpSelectItem_cancel}` : "")}
    >
      {name ? name : value}
    </span>
  );
};
