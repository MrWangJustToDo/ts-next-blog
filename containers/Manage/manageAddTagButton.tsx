import { useCallback } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { ManageAddButtonBody, ManageAddButtonTypes } from "types/containers";

const ManageAddTagButton: ManageAddButtonTypes = ({ request, successHandler, body }) => {
  const click = useManageToAddModule({
    body,
    request,
    title: "添加标签",
    successHandler,
    judgeApiName: apiName.checkTag,
  });

  return (
    <button type="button" className="float-right btn btn-info btn-sm" onClick={click}>
      管理
    </button>
  );
};

const ManageAddTagButtonWrapper: SimpleElement = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addTag, cache: false });

  const successHandler = useCallback(() => {
    request.cache.deleteRightNow(apiName.tag);
    mutate(apiName.tag);
  }, [request]);

  const body = useCallback<ManageAddButtonBody>(
    ({ request, judgeApiName, successHandler }) =>
      (closeHandler) =>
        <ManageAddModule fieldname="tagContent" request={request} judgeApiName={judgeApiName} closeHandler={closeHandler} successHandler={successHandler} />,
    []
  );

  return <ManageAddTagButton request={request} successHandler={successHandler} body={body} />;
};

export default ManageAddTagButtonWrapper;
