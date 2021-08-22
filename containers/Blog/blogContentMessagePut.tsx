import { useCallback } from "react";
import { flexBetween, getClass } from "utils/dom";
import { usePutToCheckcodeModule } from "hook/useMessage";
import BlogContentCheckcodeModule from "./blogContentCheckcodeModule";
import { UsePutToCheckcodeModuleBody } from "types/hook";
import { BlogContentMessagePutType } from "types/containers";

import style from "./index.module.scss";

const BlogContentMessagePut: BlogContentMessagePutType = ({ blogId }) => {
  const body = useCallback<UsePutToCheckcodeModuleBody>(
    ({ request, requestCallback, blogId }) =>
      (closeHandler) =>
        <BlogContentCheckcodeModule blogId={blogId} request={request} closeHandler={closeHandler} requestCallback={requestCallback} />,
    []
  );

  const { formRef, textAreaRef, canSubmit } = usePutToCheckcodeModule({
    body,
    blogId,
  });

  return (
    <li className="list-group-item">
      <form ref={formRef}>
        <textarea name="content" className="w-100 my-2 border rounded" placeholder="请输入留言" style={{ minHeight: "100px" }} ref={textAreaRef} />
        <div className={getClass(flexBetween)}>
          <button type="submit" className="btn btn-sm btn-primary" disabled={!canSubmit}>
            新留言
          </button>
          <button type="button" className={getClass("btn btn-sm btn-light", style.markdown)} title="切换markdown编辑">
            <span>.</span>
            <i className="ri-markdown-line" />
          </button>
        </div>
      </form>
    </li>
  );
};

export default BlogContentMessagePut;
