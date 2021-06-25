import { useCallback } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { Tag as TagItem } from "components/Tag";
import { getClass } from "utils/dom";
import { createRequest } from "utils/fetcher";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule } from "hook/useManage";
import ManageDeleteModule from "./manageDeleteModule";
import { UseManageToDeleteModuleBody } from "types/hook";
import { ManageDeleteTagButtonType, ManageDeleteTagItemType } from "types/containers";

import style from "./index.module.scss";

const ManageDeleteTagButton: ManageDeleteTagButtonType = ({ deleteItem, tagId }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteTag, data: { deleteTag: tagId }, cache: false });

  const successHandler = useCallback(() => {
    const tagRequest = createRequest({ apiPath: apiName.tag });
    tagRequest.deleteCache();
    mutate(tagRequest.cacheKey);
  }, [request]);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ deleteItem }) =>
      (closeHandler) =>
        <ManageDeleteModule deleteItem={deleteItem} request={request} closeHandler={closeHandler} successHandler={successHandler} />,
    []
  );

  const click = useManageToDeleteModule({
    body,
    title: "确认删除",
    deleteItem: (
      <div className="text-center">
        <hr />
        {deleteItem}
        <hr />
      </div>
    ),
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
