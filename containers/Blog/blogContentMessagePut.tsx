import { useCallback } from "react";
import { flexBetween, getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { usePutToCheckcodeModule } from "hook/useMessage";
import BlogContentCheckcodeModule from "./blogContentCheckcodeModule";
import BlogContentMessageMarkdown from "./blogContentMessageMarkdown";
import { UsePutToCheckcodeModuleBody } from "types/hook";
import { BlogContentMessagePutType } from "types/containers";

import style from "./index.module.scss";

const BlogContentMessagePut: BlogContentMessagePutType = ({ blogId }) => {
  const { bool, switchBoolDebounce } = useBool({ init: true });

  const body = useCallback<UsePutToCheckcodeModuleBody>(
    ({ request, requestCallback, blogId }) =>
      (closeHandler) =>
        <BlogContentCheckcodeModule blogId={blogId} request={request} closeHandler={closeHandler} requestCallback={requestCallback} />,
    []
  );

  const { formRef, textAreaRef, canSubmit } = usePutToCheckcodeModule(
    {
      body,
      blogId,
    },
    bool
  );

  return (
    <li className="list-group-item">
      <form ref={formRef}>
        {bool ? (
          <textarea name="content" className="w-100 my-2 border rounded" placeholder="请输入留言" style={{ minHeight: "100px" }} ref={textAreaRef} />
        ) : (
          <div className="mb-3">
            <BlogContentMessageMarkdown name="content" />
          </div>
        )}
        <div className={getClass(flexBetween)}>
          <button type="submit" className="btn btn-sm btn-primary" disabled={bool ? !canSubmit : false}>
            新留言
          </button>
          <button
            type="button"
            className={getClass("btn btn-sm btn-light", style.markdown)}
            title={`切换到${bool ? "markdown编辑" : "普通文本"}`}
            onClick={switchBoolDebounce}
          >
            <span>.</span>
            {bool ? <i className="ri-markdown-line" /> : <i className="ri-file-text-line" />}
          </button>
        </div>
      </form>
    </li>
  );
};

export default BlogContentMessagePut;
