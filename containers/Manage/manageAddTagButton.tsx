import { useCallback } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { ManageAddModule } from "./manageAddModule";
import { createRequest } from "utils/fetcher";
import { useUserRequest } from "hook/useUser";
import { useManageToAddModule } from "hook/useManage";
import { SimpleElement } from "types/components";

export const ManageAddTagButton: SimpleElement = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.addTag, cache: false });

  const successHandler = useCallback(() => {
    const tagRequest = createRequest({ apiPath: apiName.tag });
    tagRequest.deleteCache();
    mutate(tagRequest.cacheKey);
  }, []);

  const body = useCallback<(p: () => void) => JSX.Element>(
    (closeHandler) => (
      <ManageAddModule fieldName="tagContent" request={request} judgeApiName={apiName.checkTag} closeHandler={closeHandler} successHandler={successHandler} />
    ),
    [request, successHandler]
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
