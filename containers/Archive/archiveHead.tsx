import { useArchive } from "hook/useArchive";
import { flexBetween, getClass } from "utils/class";
import { SimpleElement } from "types/components";

let ArchiveHead: SimpleElement

ArchiveHead = () => {
  const { allCount } = useArchive();
  return (
    <div className="card mx-lg-4">
      <h5 className={getClass("card-header text-info bg-transparent border-0 p-3", flexBetween)}>
        <span className="small">归档</span>
        <div className="text-black-50 small">
          <span>共</span>
          <span className="text-info px-1">{allCount}</span>
          <span>篇博客</span>
        </div>
      </h5>
    </div>
  );
};

export default ArchiveHead;
