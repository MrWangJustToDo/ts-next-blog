import { useHome } from "hook/useHome";
import { SimpleElement } from "types/components";
import { flexBetween, getClass } from "utils/class";

let MainLeftHead: SimpleElement;

MainLeftHead = () => {
  let { allPage } = useHome();
  return (
    <h5 className={getClass("card-header bg-transparent text-info", flexBetween)}>
      <span>博客</span>
      <div className="text-black-50">
        共<span className="text-info px-1">{allPage}</span>页
      </div>
    </h5>
  );
};

export default MainLeftHead;
