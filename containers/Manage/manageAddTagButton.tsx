import { useCallback } from "react";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { UseManageToAddModuleBody } from "types/hook";

let ManageAddTagButton: SimpleElement;

ManageAddTagButton = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addTag });

  const body = useCallback<UseManageToAddModuleBody>(
    ({ request, requestApiName, judgeApiName }) => (closeHandler) => (
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
