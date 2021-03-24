import ArchiveHead from "./archiveHead";
import ArchiveContent from "./archiveContent";
import Loading from "components/Loading";
import { useArchive, useAutoLoadArchive } from "hook/useArchive";
import { SimpleElement } from "types/components";

let Archive: SimpleElement;

Archive = () => {
  const { value, canLoad, loadMore } = useArchive();
  useAutoLoadArchive({ canLoad, loadMore, breakPoint: 600 });
  console.log(value);
  return (
    <>
      <ArchiveHead />
      <div className="card mx-lg-4 border-0">
        {Object.keys(value!).map((year) => (
          <ArchiveContent key={year} year={year} blogProps={value![year]} />
        ))}
        {canLoad && <Loading _style={{ width: "30px", height: "30px" }} />}
      </div>
    </>
  );
};

export default Archive;
