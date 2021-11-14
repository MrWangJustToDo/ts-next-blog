import { ManageSearch } from "./manageSearch";
import { ManageResult } from "./manageResult";
import { UserProps } from "types";

export const ManageLeft = ({ userId }: Pick<UserProps, "userId">) => {
  return (
    <div className="col-md-8 user-select-none">
      <ManageSearch />
      <ManageResult userId={userId} />
    </div>
  );
};
