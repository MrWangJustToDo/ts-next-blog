import { useState } from "react";
import { Input } from "components/Input";
import { Button } from "components/Button";
import { addModule } from "config/manage";
import { useAddRequest } from "hook/useManage";
import { AutoRequestType } from "types/utils";
import { apiName } from "config/api";

export const ManageAddModule = ({
  request,
  judgeApiName,
  fieldName,
  successCallback,
}: {
  request: AutoRequestType;
  judgeApiName: apiName;
  fieldName: string;
  successCallback: () => void;
}) => {
  const [bool, setBool] = useState<boolean>(false);

  const [ref, loading] = useAddRequest({
    request,
    successCallback,
  });

  return (
    <div className="overflow-hidden p-2">
      <form ref={ref}>
        <Input autoFocus={true} name={fieldName} option={addModule.input} judgeApiName={judgeApiName} changeState={setBool} />
        <Button type="submit" className="float-right btn-info btn-sm mt-2" loading={loading} value="添加" disable={!bool} />
      </form>
    </div>
  );
};
