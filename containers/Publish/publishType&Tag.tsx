import PublishType from "./publishType";
import PublishTag from "./publishTag";
import { SimpleElement } from "types/components";

let PublishType_Tag: SimpleElement;

PublishType_Tag = () => {
  return (
    <div className="form-row mb-3">
      <PublishType />
      <PublishTag />
    </div>
  );
};

export default PublishType_Tag;
