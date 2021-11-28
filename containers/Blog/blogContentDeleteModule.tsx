import { flexEnd, getClass } from "utils/dom";
import { Button } from "components/Button";
import { useDeleteModuleToSubmit } from "hook/useMessage";
import { AutoRequestType } from "types/utils";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";

export const BlogContentDeleteModule = <T extends PrimaryMessageProps | ChildMessageProps>({ props, request }: { props: T; request: AutoRequestType }) => {
  const { formRef, loading } = useDeleteModuleToSubmit<T>({ props, request });

  return (
    <form className={getClass("row, px-3", flexEnd)} ref={formRef}>
      <Button className="btn-sm btn-danger" type="submit" loading={loading} value="确认删除" />
    </form>
  );
};
