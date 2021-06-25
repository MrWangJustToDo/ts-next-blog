import { useCallback } from "react";
import { mutate } from "swr";
import { Type as TypeItem } from "components/Type";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule } from "hook/useManage";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import ManageDeleteModule from "./manageDeleteModule";
import { UseManageToDeleteModuleBody } from "types/hook";
import { ManageDeleteTypeButtonType, ManageDeleteTypeItemType } from "types/containers";

import style from "./index.module.scss";
import { createRequest } from "utils/fetcher";

const ManageDeleteTypeButton: ManageDeleteTypeButtonType = ({ deleteItem, typeId }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteType, data: { deleteType: typeId }, cache: false });

  const successHandler = useCallback(() => {
    const typeRequest = createRequest({ apiPath: apiName.type });
    typeRequest.deleteCache();
    mutate(typeRequest.cacheKey);
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

const ManageDeleteTypeItem: ManageDeleteTypeItemType = ({ typeId, typeContent, typeCount }) => {
  return (
    <div className="m-2 position-relative">
      <TypeItem key={typeId} typeContent={typeContent!} typeCount={typeCount!} hoverAble={false} />
      <ManageDeleteTypeButton deleteItem={<TypeItem key={typeId} typeContent={typeContent!} typeCount={typeCount!} hoverAble={false} />} typeId={typeId!} />
    </div>
  );
};

export default ManageDeleteTypeItem;
