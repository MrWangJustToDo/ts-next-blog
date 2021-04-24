import { useCallback } from "react";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { UseManageToAddModuleBody } from "types/hook";

let ManageAddTypeButton: SimpleElement;

ManageAddTypeButton = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addType });

  const body = useCallback<UseManageToAddModuleBody>(
    ({ requestApiName, request, judgeApiName }) => (closeHandler) => (
      <ManageAddModule requestApiName={requestApiName} fieldname="typeContent" request={request} judgeApiName={judgeApiName} closeHandler={closeHandler} />
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
