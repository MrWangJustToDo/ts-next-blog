import PublishType from "./publishType";
import PublishTag from "./publishTag";
import { BlogContentType } from "types/containers";

const PublishType_Tag: BlogContentType = ({ typeId, tagId }) => {
  return (
    <div className="form-row mb-3">
      <PublishType typeId={typeId} />
      <PublishTag tagId={tagId} />
    </div>
  );
};

export default PublishType_Tag;
