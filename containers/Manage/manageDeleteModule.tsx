import Button from "components/Button";
import { useDeleteRequest } from "hook/useManage";
import { ManageDeleteModuleType } from "types/containers";

const ManageDeleteModule: ManageDeleteModuleType = ({ request, deleteItem, closeHandler, successHandler }) => {
  const click = useDeleteRequest({ request, closeHandler, successHandler });

  return (
    <div className="position-relative" style={{ minWidth: "250px" }}>
      <div className="text-danger m-2">删除以下项目：</div>
      {deleteItem}
      <div className="overflow-hidden">
        <Button className="btn-danger btn-sm float-right" value="确认删除" request={click} />
      </div>
    </div>
  );
};

export default ManageDeleteModule;
