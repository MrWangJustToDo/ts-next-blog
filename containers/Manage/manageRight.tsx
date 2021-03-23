import ManageTag from "./manageTag";
import ManageType from "./manageType";
import ManageAddModule from "./manageAddModule";
import { SimpleElement } from "containers/Main/@type";
import { useManageToAddModule } from "hook/useManage";
import { autoRequest } from "utils/fetcher";
import { apiName } from "config/api";

let ManageRight: SimpleElement;

ManageRight = () => {
  const request = autoRequest({ method: "post", path: apiName.addTag });
  const click = useManageToAddModule({
    request,
    title: "添加标签",
    judgeApiName: apiName.checkTag,
    body: (request) => (judgeApiName) => <ManageAddModule fieldname="tagContent" request={request} judgeApiName={judgeApiName} />,
  });
  return (
    <div className="col-md-4">
      <div className="card mt-4 mt-md-0">
        <div className="card-header" style={{ backgroundColor: "#f4f6f8" }}>
          标签
        </div>
        <ManageTag />
        <div className="card-footer small">
          <button type="button" className="float-right btn btn-info btn-sm" onClick={click}>
            管理
          </button>
        </div>
      </div>
      <div className="card mt-4">
        <div className="card-header" style={{ backgroundColor: "#f4f6f8" }}>
          分类
        </div>
        <ManageType />
        <div className="card-footer small">
          <button type="button" className="float-right btn btn-info btn-sm">
            管理
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageRight;
