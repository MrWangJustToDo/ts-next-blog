import { useCallback } from "react";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { AutoRequestType } from "types/utils";

let ManageAddTypeButton: SimpleElement;

ManageAddTypeButton = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addType });

  const body = useCallback<(request: AutoRequestType) => (judgeApiName: apiName) => (requestApiName: apiName) => JSX.Element>(
    (request) => (judgeApiName) => (requestApiName) => (
      <ManageAddModule requestApiName={requestApiName} fieldname="typeContent" request={request} judgeApiName={judgeApiName} />
    ),
    []
  );

  const click = useManageToAddModule({
    request,
    title: "添加分类",
    judgeApiName: apiName.checkType,
    requestApiName: apiName.type,
    body,
  });

  return (
    <button type="button" className="float-right btn btn-info btn-sm" onClick={click}>
      管理
    </button>
  );
};

export default ManageAddTypeButton;
