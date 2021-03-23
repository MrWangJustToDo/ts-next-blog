import { useArray, useBool } from "hook/useData";
import { flexCenter, getClass } from "utils/class";
import DropItem from "./dropItem";
import DropContainer from "./dropContainer";
import DropSelectItem from "./dropSelectItem";
import { DropProps, DropType, ValueType } from "types/components";

import styleCss from "./index.module.scss";

let Drop: DropType;

Drop = <T extends ValueType>({ data = [], className = "", placeHolder = "请选择", multiple = false, fieldName, maxHeight, style }: DropProps<T>) => {
  const [indexArr, _1, _2, onlyOne, switchItem] = useArray<number>([]);
  const { bool, switchBoolState } = useBool({ stateChangeTimeStep: 500 });
  return (
    <div
      onClick={switchBoolState}
      className={getClass("position-relative text-info border user-select-none", flexCenter, styleCss.drop, className)}
      style={style}
    >
      <input
        readOnly
        type="text"
        name={fieldName}
        style={{ display: "none" }}
        value={multiple ? indexArr.map((idx) => String(data[idx].value)).toString() : indexArr.length ? data[indexArr[0]].value : ""}
        data-show={bool}
      />
      <div>
        {indexArr.length ? (
          indexArr.map((index) => (
            <DropSelectItem key={index} idx={index} name={data[index].name} value={data[index].value} multiple={multiple} cacel={switchItem} />
          ))
        ) : (
          <div className="m-1">{placeHolder}</div>
        )}
      </div>
      <i className="ri-arrow-down-s-fill position-absolute" style={{ right: multiple ? "4px" : "12px" }} />
      <DropContainer bool={bool} length={data.length} maxHeight={maxHeight}>
        {data.map(({ name, value }, idx) => (
          <DropItem<T> key={value} value={value} name={name} clickHandler={multiple ? switchItem : onlyOne} checkedIndex={indexArr} index={idx} />
        ))}
      </DropContainer>
    </div>
  );
};

export default Drop;
