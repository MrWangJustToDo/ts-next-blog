import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { log } from "utils/log";
import { flexBetween, getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { usePutToCheckCodeModule, UsePutToCheckCodeModuleBody } from "hook/useMessage";
import { BlogContentCheckCodeModule } from "./blogContentCheckCodeModule";
import { BlogContentMessageMarkdownWithMemo } from "./blogContentMessageMarkdown";
import { BlogProps } from "types";

import style from "./index.module.scss";

export const BlogContentMessageTextArea = ({
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

export const BlogContentMessagePut = ({ blogId }: Pick<BlogProps, "blogId">) => {
  const { bool, switchBoolDebounce, hide } = useBool();

  const body = useCallback<UsePutToCheckCodeModuleBody>(
    ({ request, requestCallback, blogId }) =>
      (closeHandler) => {
        const CheckCode = <BlogContentCheckCodeModule blogId={blogId} request={request} closeHandler={closeHandler} requestCallback={requestCallback} />;
        return CheckCode;
      },
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
          <BlogContentMessageMarkdownWithMemo className="mb-3" name="content" forwardRef={textAreaRef} />
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
