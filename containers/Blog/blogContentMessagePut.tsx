import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { log } from "utils/log";
import { flexBetween, getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { usePutToCheckCodeModule } from "hook/useMessage";
import BlogContentCheckCodeModule from "./blogContentCheckCodeModule";
import BlogContentMessageMarkdown from "./blogContentMessageMarkdown";
import { UsePutToCheckCodeModuleBody } from "types/hook";
import { BlogContentMessagePutType } from "types/containers";

import style from "./index.module.scss";

const BlogContentMessageTextArea = ({
  forwardRef,
  name = "content",
  defaultValue = "",
}: {
  forwardRef?: MutableRefObject<HTMLTextAreaElement | null>;
  name?: string;
  defaultValue?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  // use effect to handle element
  useEffect(() => {
    if (forwardRef && ref.current) {
      forwardRef.current = ref.current.querySelector(`#${name}`);
      return () => {
        forwardRef.current = null;
      };
    } else {
      log("textarea handle element error", "error");
    }
  }, []);
  return (
    <div ref={ref} data-ele="textarea">
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="w-100 my-2 border rounded"
        placeholder="请输入留言"
        style={{ minHeight: "100px" }}
      />
    </div>
  );
};

const BlogContentMessagePut: BlogContentMessagePutType = ({ blogId }) => {
  const { bool, switchBoolDebounce, hide } = useBool();

  const body = useCallback<UsePutToCheckCodeModuleBody>(
    ({ request, requestCallback, blogId }) =>
      (closeHandler) =>
        <BlogContentCheckCodeModule blogId={blogId} request={request} closeHandler={closeHandler} requestCallback={requestCallback} />,
    []
  );

  const { formRef, textAreaRef, canSubmit } = usePutToCheckCodeModule({
    body,
    blogId,
    isMd: Number(bool),
    submitCallback: hide,
  });

  return (
    <li className="list-group-item">
      <form ref={formRef}>
        {bool ? (
          <BlogContentMessageMarkdown className="mb-3" name="content" forwardRef={textAreaRef} />
        ) : (
          <BlogContentMessageTextArea name="content" forwardRef={textAreaRef} />
        )}
        <div className={getClass(flexBetween)}>
          <button type="submit" className="btn btn-sm btn-primary" disabled={!canSubmit}>
            新留言
          </button>
          <button
            type="button"
            className={getClass("btn btn-sm btn-light", style.markdown)}
            title={`切换到${bool ? "普通文本" : "markdown编辑"}`}
            onClick={switchBoolDebounce}
          >
            <span>.</span>
            {bool ? <i className="ri-file-text-line" /> : <i className="ri-markdown-line" />}
          </button>
        </div>
      </form>
    </li>
  );
};

export { BlogContentMessageTextArea };

export default BlogContentMessagePut;
