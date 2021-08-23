import { flexEnd, getClass } from "utils/dom";
import Button from "components/Button";
import { useDeleteModuleToSubmit } from "hook/useMessage";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";
import { BlogContentDeleteModuleProps, BlogContentDeleteModuleType } from "types/containers";

const BlogContentDeleteModule: BlogContentDeleteModuleType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  request,
  closeHandler,
}: BlogContentDeleteModuleProps<T>) => {
  const { formRef, loading } = useDeleteModuleToSubmit<T>({ props, request, closeHandler });

  return (
    <form className={getClass("row, px-3", flexEnd)} ref={formRef}>
      <Button className="btn-sm btn-danger" type="submit" loading={loading} value="确认删除" />
    </form>
  );
};

export default BlogContentDeleteModule;
