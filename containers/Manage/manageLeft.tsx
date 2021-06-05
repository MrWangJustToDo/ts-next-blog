import ManageSearch from "./manageSearch";
import ManageResult from "./manageResult";
import { ManageUserIdType } from "types/containers";

const ManageLeft: ManageUserIdType = ({ userId }) => {
  return (
    <div className="col-md-8 user-select-none">
      <ManageSearch />
      <ManageResult userId={userId} />
    </div>
  );
};

export default ManageLeft;
