import PublishType from "./publishType";
import PublishTag from "./publishTag";
import { BlogContentType } from "types/containers";

let PublishType_Tag: BlogContentType;

PublishType_Tag = ({ typeId, tagId }) => {
  return (
    <div className="form-row mb-3">
      <PublishType typeId={typeId} />
      <PublishTag tagId={tagId} />
    </div>
  );
};

export default PublishType_Tag;
