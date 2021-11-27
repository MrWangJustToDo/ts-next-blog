import { MouseEvent, useCallback } from "react";
import { animateFadeIn, getClass } from "utils/dom";
import { DropSelectItemType } from "types/components";

import style from "./index.module.scss";

export const DropSelectItem: DropSelectItemType = ({ idx, name, value, cancel, multiple }) => {
  const cancelCallback = useCallback<(e: MouseEvent) => void>(
    (e) => {
      e.stopPropagation();
      cancel(idx);
    },
    [cancel, idx]
  );

  return (
    <span
      onClick={cancelCallback}
      className={getClass("d-inline-block m-1 rounded border-info", style.drpSelectItem, multiple ? "border" : "", style.drpSelectItem_cancel, animateFadeIn)}
    >
      {name ? name : value}
    </span>
  );
};
