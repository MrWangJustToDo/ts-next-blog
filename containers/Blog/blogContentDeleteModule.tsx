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
  const click = useDeleteModuleToSubmit<T>({ props, request, closeHandler });

  return (
    <div className={getClass("row, px-3", flexEnd)}>
      <Button className="btn-sm btn-danger" request={click} value="确认删除" />
    </div>
  );
};

export default BlogContentDeleteModule;
