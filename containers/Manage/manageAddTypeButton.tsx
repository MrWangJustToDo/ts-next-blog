import { useCallback } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import ManageAddModule from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { createRequest } from "utils/fetcher";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";
import { ManageAddButtonBody, ManageAddButtonTypes } from "types/containers";

const ManageAddTypeButton: ManageAddButtonTypes = ({ body }) => {
  const click = useManageToAddModule({
    body,
    title: "添加分类",
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
    const typeRequest = createRequest({ apiPath: apiName.type });
    typeRequest.deleteCache();
    mutate(typeRequest.cacheKey);
  }, []);

  const body = useCallback<ManageAddButtonBody>(
    (closeHandler) => (
      <ManageAddModule fieldname="typeContent" request={request} judgeApiName={apiName.checkType} closeHandler={closeHandler} successHandler={successHandler} />
    ),
    [request, successHandler]
  );

  return <ManageAddTypeButton body={body} />;
};

export default ManageAddTypeButtonWrapper;
