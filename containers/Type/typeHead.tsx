import { useType } from "hook/useType";
import { WithChangeType as TypeItem } from "components/Type";
import { flexBetween, flexCenter, getClass } from "utils/class";
import { SimpleElement } from "types/components";

let TypeHead: SimpleElement;

TypeHead = () => {
  const { type, currentType } = useType();

  return (
    <div className="card mx-lg-4">
      <h5 className={getClass("card-header text-info user-select-none", flexBetween)}>
        <span className="small">分类</span>
        <div className="text-black-50 small">
          <span>共</span>
          <span className="text-info px-1">{type.length}</span>
          <span>个</span>
        </div>
      </h5>
      <div className="card-body d-flex flex-wrap">
        {type.length ? (
          type.map(({ typeId, typeContent, typeCount }) => (
            <div key={typeId} className="m-2">
              <TypeItem typeCount={typeCount!} typeContent={typeContent!} className={currentType === typeContent ? "active" : ""} />
            </div>
          ))
        ) : (
          <div className={getClass("p-2 text-danger", flexCenter)}>nothing to display</div>
        )}
      </div>
    </div>
  );
};

export default TypeHead;
