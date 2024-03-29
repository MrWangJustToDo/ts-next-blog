import { Button } from "components/Button";
import { useRouter } from "next/dist/client/router";

export const PublishSubmit = ({ submit }: { submit: () => Promise<void> }) => {
  const router = useRouter();

  return (
    <div className="form-row mb-5 mt-3 flex-row-reverse">
      <Button request={submit} className="btn-info mx-2 active" value="发布" />
      <input onClick={router.back} className="btn btn-secondary mx-2" type="button" value="返回" />
    </div>
  );
};
