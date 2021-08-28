import { useCallback, useState } from "react";
import Input from "components/Input";
import Button from "components/Button";
import { addModule } from "config/manage";
import { useAddRequest } from "hook/useManage";
import { ManageAddModuleType } from "types/containers";

const ManageAddModule: ManageAddModuleType = ({ request, judgeApiName, fieldname, successHandler, closeHandler }) => {
  const [bool, setBool] = useState<boolean>(false);

  const successCallback = useCallback(() => {
    successHandler();
    closeHandler();
  }, [closeHandler, successHandler]);

  const [ref, loading] = useAddRequest({
    request,
    successCallback,
  });

  return (
    <div className="overflow-hidden p-2">
      <form ref={ref}>
        <Input autoFocus={true} name={fieldname} option={addModule.input} judgeApiName={judgeApiName} changeState={setBool} />
        <Button type="submit" className="float-right btn-info btn-sm mt-2" loading={loading} value="添加" disable={!bool} />
      </form>
    </div>
  );
};

export default ManageAddModule;
