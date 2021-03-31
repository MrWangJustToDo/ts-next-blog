import { useCallback } from "react";
import { mutate } from "swr";
import { Type as TypeItem } from "components/Type";
import { useUserRequest } from "hook/useUser";
import { useManageToDeleteModule } from "hook/useManage";
import { apiName } from "config/api";
import { getClass } from "utils/class";
import ManageDeleteModule from "./manageDeleteModule";
import { AutoRequestType } from "types/utils";
import { ManageDeleteTypeItemType } from "types/containers";

import style from "./index.module.scss";

let ManageDeleteTypeItem: ManageDeleteTypeItemType;

ManageDeleteTypeItem = ({ typeId, typeContent, typeCount }) => {
  const request = useUserRequest({ method: "post", apiPath: apiName.deleteType, data: { deleteType: typeId } });

  const body = useCallback<(request: AutoRequestType) => (item: JSX.Element) => (successCallback: () => void) => (close: () => void) => JSX.Element>(
    (request) => (item) => (successCallback) => (close) => <ManageDeleteModule item={item} request={request} close={close} successCallback={successCallback} />,
    []
  );

  const successCallback = useCallback(() => mutate(apiName.type), []);

  const click = useManageToDeleteModule({
    title: "确认删除",
    item: (
      <div className="text-center">
        <hr />
        <TypeItem key={typeId} typeContent={typeContent!} typeCount={typeCount!} hoverAble={false} />
        <hr />
      </div>
    ),
    body,
    request,
    successCallback,
  });

  return (
    <div className="m-2 position-relative">
      <TypeItem key={typeId} typeContent={typeContent!} typeCount={typeCount!} hoverAble={false} />
      <i
        className={getClass("position-absolute ri-close-circle-fill", style.closeIcon)}
        style={{ left: "calc(100% - 10px)", bottom: "calc(100% - 12px)" }}
        onClick={click}
      />
    </div>
  );
};

export default ManageDeleteTypeItem;
