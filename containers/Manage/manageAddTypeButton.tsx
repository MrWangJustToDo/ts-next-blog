import { useCallback } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { ManageAddButtonBody, ManageAddButtonTypes } from "types/containers";

const ManageAddTypeButton: ManageAddButtonTypes = ({ request, successHandler, body }) => {
  const click = useManageToAddModule({
    body,
    request,
    title: "添加分类",
    successHandler,
    judgeApiName: apiName.checkType,
  });

  return (
    <button type="button" className="float-right btn btn-info btn-sm" onClick={click}>
      管理
    </button>
  );
};

const ManageAddTypeButtonWrapper: SimpleElement = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addType, cache: false });

  const successHandler = useCallback(() => {
    request.cache.deleteRightNow(apiName.type);
    mutate(apiName.type);
  }, [request]);

  const body = useCallback<ManageAddButtonBody>(
    ({ request, judgeApiName, successHandler }) =>
      (closeHandler) =>
        <ManageAddModule fieldname="typeContent" request={request} judgeApiName={judgeApiName} closeHandler={closeHandler} successHandler={successHandler} />,
    []
  );

  return <ManageAddTypeButton request={request} body={body} successHandler={successHandler} />;
};

export default ManageAddTypeButtonWrapper;
