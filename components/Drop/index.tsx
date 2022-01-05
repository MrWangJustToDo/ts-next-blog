import { useArray, useBool } from "hook/useData";
import { animateFadeIn, flexCenter, getClass } from "utils/dom";
import { DropItem } from "./dropItem";
import { DropContainer } from "./dropContainer";
import { DropSelectItem } from "./dropSelectItem";
import { DropProps, DropType, ValueType } from "types/components";

import style from "./index.module.scss";

export const Drop: DropType = <T extends ValueType>({
  data = [],
  className = "",
  placeHolder = "请选择",
  multiple = false,
  fieldName,
  maxHeight,
  _style,
  initData = [],
}: DropProps<T>) => {
  const [indexArr, _1, _2, onlyOne, switchItem] = useArray<number>(initData);

  const { bool, switchBoolDebounce } = useBool();

  return (
    <div
      onClick={switchBoolDebounce}
      className={getClass("position-relative text-info border user-select-none", flexCenter, style.drop, className)}
      style={_style}
    >
      <input
        readOnly
        type="text"
        name={fieldName}
        style={{ display: "none" }}
        value={
          multiple
            ? indexArr
                .map((idx) => String(data[idx]?.value))
                .filter(Boolean)
                .join(",")
            : indexArr.length
            ? data[indexArr[0]]?.value || "null"
            : ""
        }
        data-multiple={multiple}
      />
      <div>
        {indexArr.length ? (
          indexArr.map((index) => (
            <DropSelectItem
              key={index}
              idx={index}
              name={data[index]?.name || "null"}
              value={data[index]?.value || undefined}
              multiple={multiple}
              cancel={switchItem}
            />
          ))
        ) : (
          <div className={getClass("m-1", animateFadeIn)}>{placeHolder}</div>
        )}
      </div>
      <i
        className="ri-arrow-down-s-fill position-absolute"
        style={{ right: multiple ? "4px" : "12px", transform: !bool ? "rotate(0deg)" : "rotate(180deg)", transition: "transform .3s" }}
      />
      <DropContainer bool={bool} length={data.length} maxHeight={maxHeight}>
        {data.map(({ name, value }, idx) => (
          <DropItem<T> key={value} value={value} name={name} clickHandler={multiple ? switchItem : onlyOne} checkedIndex={indexArr} index={idx} />
        ))}
      </DropContainer>
    </div>
  );
};
