import { useCallback } from "react";
import BlogContentCheckcodeModule from "./blogContentCheckcodeModule";
import { usePutToCheckcodeModule } from "hook/useMessage";
import { UsePutToCheckcodeModuleBody } from "types/hook";
import { BlogContentMessagePutType } from "types/containers";

const BlogContentMessagePut: BlogContentMessagePutType = ({ blogId }) => {
  const body = useCallback<UsePutToCheckcodeModuleBody>(
    ({ request, ref, successCallback }) =>
      (closeHandler) =>
        <BlogContentCheckcodeModule request={request} closeHandler={closeHandler} messageRef={ref} successCallback={successCallback} />,
    []
  );

  const { ref, submit, canSubmit } = usePutToCheckcodeModule<HTMLTextAreaElement>({
    body,
    blogId,
  });

  return (
    <li className="list-group-item">
      <textarea className="w-100 my-2 border rounded" placeholder="请输入留言" style={{ minHeight: "100px" }} ref={ref} />
      <button className="btn btn-sm btn-primary" onClick={submit} disabled={!canSubmit}>
        新留言
      </button>
    </li>
  );
};

export default BlogContentMessagePut;
