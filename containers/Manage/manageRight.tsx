import ManageTag from "./manageTag";
import ManageType from "./manageType";
import ManageAddTagButton from "./manageAddTagButton";
import ManageAddTypeButton from "./manageAddTypeButton";
import { SimpleElement } from "types/components";

let ManageRight: SimpleElement;

ManageRight = () => {
  return (
    <div className="col-md-4">
      <div className="card mt-4 mt-md-0">
        <div className="card-header" style={{ backgroundColor: "#f4f6f8" }}>
          标签
        </div>
        <ManageTag />
        <div className="card-footer small">
          <ManageAddTagButton />
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header" style={{ backgroundColor: "#f4f6f8" }}>
          分类
        </div>
        <ManageType />
        <div className="card-footer small">
          <ManageAddTypeButton />
        </div>
      </div>
    </div>
  );
};

export default ManageRight;
