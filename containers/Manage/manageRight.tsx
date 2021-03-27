import { useCallback } from "react";
import ManageTag from "./manageTag";
import ManageType from "./manageType";
import ManageAddModule from "./manageAddModule";
import { useManageToAddModule } from "hook/useManage";
import { apiName } from "config/api";
import { SimpleElement } from "types/components";
import { AutoRequestType } from "types/utils";
import { useUserRequest } from "hook/useUser";

let ManageRight: SimpleElement;

ManageRight = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addTag });

  const body = useCallback<(request: AutoRequestType) => (judgeApiName: apiName) => (requestApiName: apiName) => JSX.Element>(
    (request) => (judgeApiName) => (requestApiName) => (
      <ManageAddModule requestApiName={requestApiName} fieldname="tagContent" request={request} judgeApiName={judgeApiName} />
    ),
    []
  );

  const click = useManageToAddModule({
    request,
    title: "添加标签",
    judgeApiName: apiName.checkTag,
    requestApiName: apiName.tag,
    body,
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
