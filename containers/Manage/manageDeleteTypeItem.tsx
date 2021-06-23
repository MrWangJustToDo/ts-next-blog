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

const ManageDeleteTypeButton: ManageDeleteTypeButtonType = ({ deleteItem, typeId }) => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteType, data: { deleteType: typeId } });

  const successHandler = useCallback(() => {
    request.cache.deleteRightNow(apiName.type);
    mutate(apiName.type);
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

const ManageDeleteTypeItem: ManageDeleteTypeItemType = ({ typeId, typeContent, typeCount }) => {
  return (
    <div className="m-2 position-relative">
      <TypeItem key={typeId} typeContent={typeContent!} typeCount={typeCount!} hoverAble={false} />
      <ManageDeleteTypeButton deleteItem={<TypeItem key={typeId} typeContent={typeContent!} typeCount={typeCount!} hoverAble={false} />} typeId={typeId!} />
    </div>
  );
};

export default ManageDeleteTypeItem;
