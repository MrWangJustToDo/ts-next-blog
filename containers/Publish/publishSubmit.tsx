import Button from "components/Button";
import { PublishSubmitType } from "types/containers";

let PublishSubmit: PublishSubmitType;

PublishSubmit = ({ submit }) => {
  return (
    <div className="form-row mb-5 mt-3 flex-row-reverse">
      <Button request={submit} className="btn-info mx-2 active" value={"发布"} />
      <input className="btn btn-secondary mx-2" type="button" value="返回" />
    </div>
  );
};

export default PublishSubmit;
