import { memo, MutableRefObject, useCallback, useEffect, useRef } from "react";
import MdEditor from "react-markdown-editor-lite";
import { useEditor } from "hook/useBlog";
import { log } from "utils/log";
import { markNOLineNumber } from "utils/markdown";

import "react-markdown-editor-lite/lib/index.css";

const BlogContentMessageMarkdown = ({
  forwardRef,
  name = "content",
  defaultValue = "",
  className = "",
}: { name?: string; defaultValue?: string; forwardRef?: MutableRefObject<HTMLTextAreaElement | null>; className?: string } = {}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (forwardRef && ref.current) {
      forwardRef.current = ref.current.querySelector(`#editor_${name}_md`);
      return () => {
        forwardRef.current = null;
      };
    } else {
      log("markdown element handle error", "error");
    }
  }, []);

  if (process.browser) {
    useEditor(name);
  }

  const mdRender = useCallback((text) => markNOLineNumber.render(text), []);

  return (
    <div ref={ref} className={className} data-ele="markdown">
      <MdEditor
        name={name}
        id={`editor_${name}`}
        renderHTML={mdRender}
        placeholder="请输入内容"
        defaultValue={defaultValue}
        style={{ minHeight: "40vh", borderRadius: "3px" }}
      />
    </div>
  );
};

// use memo to prevent render
export default memo(BlogContentMessageMarkdown);
