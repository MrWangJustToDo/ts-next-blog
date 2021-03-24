import { useState } from "react";
import Input from "components/Input";
import Button from "components/Button";
import { addModule } from "config/manage";
import { ManageAddModuleType } from "types/containers";

let ManageAddModule: ManageAddModuleType;

ManageAddModule = ({ request, judgeApiName, fieldname }) => {
  const [bool, setBool] = useState<boolean>(true);
  return (
    <div className="overflow-hidden p-2">
      <Input name={fieldname} option={addModule.input} judgeApiName={judgeApiName} changeState={setBool} />
      <Button className="float-right btn-info btn-sm mt-2" request={request.run} value="添加" disable={!bool} />
    </div>
  );
};

export default ManageAddModule;
