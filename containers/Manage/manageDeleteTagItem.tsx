import { useCallback } from "react";
import { mutate } from "swr";
import { Tag as TagItem } from "components/Tag";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule } from "hook/useManage";
import { apiName } from "config/api";
import { getClass } from "utils/class";
import ManageDeleteModule from "./manageDeleteModule";
import { AutoRequestType } from "types/utils";
import { ManageDeleteTagItemType } from "types/containers";

import style from "./index.module.scss";

let ManageDeleteTagItem: ManageDeleteTagItemType;

ManageDeleteTagItem = ({ tagId, tagContent, tagCount }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteTag, data: { deleteTag: tagId } });

  const body = useCallback<(request: AutoRequestType) => (item: JSX.Element) => (successCallback: () => void) => (close: () => void) => JSX.Element>(
    (request) => (item) => (successCallback) => (close) => <ManageDeleteModule item={item} request={request} close={close} successCallback={successCallback} />,
    []
  );

  const successCallback = useCallback(() => mutate(apiName.tag), []);

  const click = useManageToDeleteModule({
    title: "确认删除",
    item: (
      <div className="text-center">
        <hr />
        <TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />
        <hr />
      </div>
    ),
    body,
    request,
    successCallback,
  });

  return (
    <div className="m-2 position-relative">
      <TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />
      <i
        className={getClass("position-absolute ri-close-circle-fill", style.closeIcon)}
        style={{ left: "calc(100% - 8px)", bottom: "calc(100% - 8px)" }}
        onClick={click}
      />
    </div>
  );
};

export default ManageDeleteTagItem;
