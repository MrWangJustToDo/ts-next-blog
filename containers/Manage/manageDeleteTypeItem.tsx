import { useCallback, useMemo } from "react";
import { mutate } from "swr";
import { Type as TypeItem } from "components/Type";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule, UseManageToDeleteModuleBody } from "hook/useManage";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import { createRequest } from "utils/fetcher";
import { ManageDeleteModule } from "./manageDeleteModule";
import { TypeProps } from "types";

import style from "./index.module.scss";

const ManageDeleteTypeButton = ({ deleteItem, typeId, typeContent }: { deleteItem: JSX.Element; typeId: string; typeContent: string }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteType, data: { deleteType: typeId, typeContent }, cache: false });

  const successHandler = useCallback(() => {
    const typeRequest = createRequest({ apiPath: apiName.type });
    typeRequest.deleteCache();
    mutate(typeRequest.cacheKey);
  }, []);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ deleteItem }) =>
      (closeHandler) => {
        const WithDelete = <ManageDeleteModule deleteItem={deleteItem} request={request} closeHandler={closeHandler} successHandler={successHandler} />;
        return WithDelete;
      },
    [request, successHandler]
  );

  const deleteItemWrapper = useMemo(
    () => (
      <div className="text-center">
        <hr />
        {deleteItem}
        <hr />
      </div>
    ),
    [deleteItem]
  );

  const click = useManageToDeleteModule({
    body,
    title: "确认删除",
    deleteItem: deleteItemWrapper,
  });

  return (
    <i
      className={getClass("position-absolute ri-close-circle-fill", style.closeIcon)}
      style={{ left: "calc(100% - 8px)", bottom: "calc(100% - 8px)" }}
      onClick={click}
    />
  );
};

export const ManageDeleteTypeItem = ({ typeId, typeContent, typeCount }: TypeProps) => {
  const item = <TypeItem key={typeId} typeContent={typeContent} typeCount={typeCount} hoverAble={false} />;
  return (
    <div className="m-2 position-relative">
      {item}
      <ManageDeleteTypeButton deleteItem={item} typeId={typeId} typeContent={typeContent} />
    </div>
  );
};
