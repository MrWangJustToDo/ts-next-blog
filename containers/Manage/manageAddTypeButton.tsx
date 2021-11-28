import { useCallback, useMemo } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { ManageAddModule } from "./manageAddModule";
import { useUserRequest } from "hook/useUser";
import { createRequest } from "utils/fetcher";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";

export const ManageAddTypeButton: SimpleElement = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addType, cache: false });

  const successCallback = useCallback(() => {
    const typeRequest = createRequest({ apiPath: apiName.type });
    typeRequest.deleteCache();
    mutate(typeRequest.cacheKey);
  }, []);

  const body = useMemo(() => <ManageAddModule fieldName="typeContent" request={request} judgeApiName={apiName.checkType} successCallback={successCallback} />, [request, successCallback])

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
