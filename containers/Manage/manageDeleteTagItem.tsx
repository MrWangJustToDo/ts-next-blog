import { useCallback } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { Tag as TagItem } from "components/Tag";
import { getClass } from "utils/dom";
import { createRequest } from "utils/fetcher";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule, UseManageToDeleteModuleBody } from "hook/useManage";
import { ManageDeleteModule } from "./manageDeleteModule";
import { ServerTagProps } from "types";

import style from "./index.module.scss";

const ManageDeleteTagButton = ({ deleteItem, tagId }: { deleteItem: JSX.Element; tagId: string }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteTag, data: { deleteTag: tagId }, cache: false });

  const successHandler = useCallback(() => {
    const tagRequest = createRequest({ apiPath: apiName.tag });
    tagRequest.deleteCache();
    mutate(tagRequest.cacheKey);
  }, []);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ deleteItem }) =>
      (closeHandler) => {
        const WithDelete = <ManageDeleteModule deleteItem={deleteItem} request={request} closeHandler={closeHandler} successHandler={successHandler} />;
        return WithDelete;
      },
    [request, successHandler]
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

export const ManageDeleteTagItem = ({ tagId, tagContent, tagCount }: ServerTagProps) => {
  return (
    <div className="m-2 position-relative">
      <TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />
      <ManageDeleteTagButton deleteItem={<TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />} tagId={tagId!} />
    </div>
  );
};
