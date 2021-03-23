import ManageLeft from "./manageLeft";
import ManageRight from "./manageRight";
import { SimpleElement } from "containers/Main/@type";

let Manage: SimpleElement;

Manage = () => {
  return (
    <div className="row px-lg-4 px-sm-2">
      <ManageLeft />
      <ManageRight />
    </div>
  );
};

export default Manage;
