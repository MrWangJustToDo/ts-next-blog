import { useCallback, useState } from "react";
import { mutate } from "swr";
import Input from "components/Input";
import Button from "components/Button";
import { addModule } from "config/manage";
import { useAddRequest } from "hook/useManage";
import { ManageAddModuleType } from "types/containers";

const ManageAddModule: ManageAddModuleType = ({ request, judgeApiName, fieldname, requestApiName, closeHandler }) => {
  const [bool, setBool] = useState<boolean>(true);

  const successCallback = useCallback(() => {
    mutate(requestApiName);
    closeHandler();
  }, [closeHandler, requestApiName]);

  const [ref, doRequest] = useAddRequest({
    request,
    successCallback,
  });

  return (
    <div className="overflow-hidden p-2">
      <Input forWardRef={ref} name={fieldname} option={addModule.input} judgeApiName={judgeApiName} changeState={setBool} />
      <Button className="float-right btn-info btn-sm mt-2" request={doRequest} value="添加" disable={!bool} />
    </div>
  );
};

export default ManageAddModule;
