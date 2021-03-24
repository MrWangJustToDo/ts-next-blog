import ManageSearch from "./manageSearch";
import ManageResult from "./manageResult";
import { SimpleElement } from "types/components";

let ManageLeft: SimpleElement;

ManageLeft = () => {
  return (
    <div className="col-md-8 user-select-none">
      <ManageSearch />
      <ManageResult />
    </div>
  );
};

export default ManageLeft;
