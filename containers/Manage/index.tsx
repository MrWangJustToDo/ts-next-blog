import { ManageUserIdType } from "types/containers";
import ManageLeft from "./manageLeft";
import ManageRight from "./manageRight";

let Manage: ManageUserIdType;

Manage = ({userId}) => {
  return (
    <div className="row px-lg-4 px-sm-2">
      <ManageLeft userId={userId} />
      <ManageRight />
    </div>
  );
};

export default Manage;
