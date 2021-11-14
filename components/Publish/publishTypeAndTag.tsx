import { PublishType } from "./publishType";
import { PublishTag } from "./publishTag";
import { ClientTagProps, TypeProps } from "types";

export const PublishTypeAndTag = ({ typeId, tagId }: Partial<Pick<TypeProps, "typeId"> & Pick<ClientTagProps, "tagId">>) => {
  return (
    <div className="form-row mb-3">
      <PublishType typeId={typeId} />
      <PublishTag tagId={tagId} />
    </div>
  );
};
