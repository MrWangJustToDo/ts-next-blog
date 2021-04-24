import { useCallback } from "react";
import { usePutToCheckcodeModule } from "hook/useMessage";
import BlogContentCheckcodeModule from "./blogContentCheckcodeModule";
import { UsePutToCheckcodeModuleBody } from "types/hook";
import { BlogContentMessagePutType } from "types/containers";

import style from "./index.module.scss";

let BlogContentMessagePut: BlogContentMessagePutType;

BlogContentMessagePut = ({ blogId }) => {
  const body = useCallback<UsePutToCheckcodeModuleBody>(
    ({ request, ref, successCallback }) => (closeHandler) => (
      <BlogContentCheckcodeModule request={request} closeHandler={closeHandler} messageRef={ref} successCallback={successCallback} />
    ),
    []
  );

  const { ref, submit, canSubmit } = usePutToCheckcodeModule<HTMLTextAreaElement>({
    body,
    blogId,
    className: style.imgCheck,
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
