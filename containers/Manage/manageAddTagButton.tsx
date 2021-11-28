import { useCallback, useMemo } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { ManageAddModule } from "./manageAddModule";
import { createRequest } from "utils/fetcher";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";

export const ManageAddTagButton: SimpleElement = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addTag, cache: false });

  const successCallback = useCallback(() => {
    const tagRequest = createRequest({ apiPath: apiName.tag });
    tagRequest.deleteCache();
    mutate(tagRequest.cacheKey);
  }, []);

  const body = useMemo(
    () => <ManageAddModule fieldName="tagContent" request={request} judgeApiName={apiName.checkTag} successCallback={successCallback} />,
    [request, successCallback]
  );

  const click = useManageToAddModule({
    body,
    title: "添加标签",
  });

  return (
    <button type="button" className="float-right btn btn-info btn-sm" onClick={click}>
      管理
    </button>
  );
};
