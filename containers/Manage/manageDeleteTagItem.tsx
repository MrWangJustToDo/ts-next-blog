import { useCallback } from "react";
import { mutate } from "swr";
import { Tag as TagItem } from "components/Tag";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule } from "hook/useManage";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import ManageDeleteModule from "./manageDeleteModule";
import { UseManageToDeleteModuleBody } from "types/hook";
import { ManageDeleteTagButtonType, ManageDeleteTagItemType } from "types/containers";

import style from "./index.module.scss";

const ManageDeleteTagButton: ManageDeleteTagButtonType = ({ deleteItem, tagId }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteTag, data: { deleteTag: tagId } });

  const successHandler = useCallback(() => {
    request.cache.deleteRightNow(apiName.tag);
    mutate(apiName.tag);
  }, [request]);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ request, deleteItem, successHandler }) =>
      (closeHandler) =>
        <ManageDeleteModule deleteItem={deleteItem} request={request} closeHandler={closeHandler} successHandler={successHandler} />,
    []
  );

  const click = useManageToDeleteModule({
    title: "确认删除",
    deleteItem: (
      <div className="text-center">
        <hr />
        {deleteItem}
        <hr />
      </div>
    ),
    body,
    request,
    successHandler,
  });

  return (
    <i
      className={getClass("position-absolute ri-close-circle-fill", style.closeIcon)}
      style={{ left: "calc(100% - 8px)", bottom: "calc(100% - 8px)" }}
      onClick={click}
    />
  );
};

const ManageDeleteTagItem: ManageDeleteTagItemType = ({ tagId, tagContent, tagCount }) => {
  return (
    <div className="m-2 position-relative">
      <TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />
      <ManageDeleteTagButton deleteItem={<TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />} tagId={tagId!} />
    </div>
  );
};

export default ManageDeleteTagItem;
