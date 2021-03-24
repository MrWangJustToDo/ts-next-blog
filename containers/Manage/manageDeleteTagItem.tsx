import { Tag as TagItem } from "components/Tag";
import { apiName } from "config/api";
// import { useDeleteTag } from "hook/useTag";
import { useManageToDeleteModule } from "hook/useManage";
import { getClass } from "utils/class";
import { createRequest } from "utils/fetcher";
import ManageDeleteModule from "./manageDeleteModule";

import style from "./index.module.scss";
import { ManageDeleteTagItemType } from "types/containers";
import { useCallback, useMemo } from "react";
import { AutoRequestType } from "types/utils";

let ManageDeleteTagItem: ManageDeleteTagItemType;

ManageDeleteTagItem = ({ tagId, tagContent, tagCount }) => {
  const request = useMemo(() => createRequest({ method: "post", path: apiName.deleteTag, data: { deleteTag: tagId } }), [tagId]);

  const body = useCallback<(request: AutoRequestType) => (item: JSX.Element) => (successCallback: () => void) => (close: () => void) => JSX.Element>(
    (request) => (item) => (successCallback) => (close) => <ManageDeleteModule item={item} request={request} close={close} successCallback={successCallback} />,
    []
  );

  const click = useManageToDeleteModule({
    title: "确认删除",
    item: <TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />,
    body,
    request,
    successCallback: console.log,
  });
  return (
    <div className="m-1 position-relative">
      <TagItem hoverAble={false} key={tagId} tagContent={tagContent!} tagCount={tagCount!} />
      <i
        className={getClass("position-absolute ri-close-circle-fill", style.closeIcon)}
        style={{ left: "calc(100% - 6px)", bottom: "calc(100% - 7px)" }}
        onClick={click}
      />
    </div>
  );
};

export default ManageDeleteTagItem;
