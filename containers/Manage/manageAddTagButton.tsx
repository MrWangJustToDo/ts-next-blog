import { useCallback } from "react";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { AutoRequestType } from "types/utils";

let ManageAddTagButton: SimpleElement;

ManageAddTagButton = () => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.addTag });

  const body = useCallback<(request: AutoRequestType) => (judgeApiName: apiName) => (requestApiName: apiName) => (closeHandler: () => void) => JSX.Element>(
    (request) => (judgeApiName) => (requestApiName) => (closeHandler) => (
      <ManageAddModule requestApiName={requestApiName} fieldname="tagContent" request={request} judgeApiName={judgeApiName} closeHandler={closeHandler} />
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
    <button type="button" className="float-right btn btn-info btn-sm" onClick={click}>
      管理
    </button>
  );
};

export default ManageAddTagButton;
