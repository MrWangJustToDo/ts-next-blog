import dynamic from "next/dynamic";
import { memo, MutableRefObject, useCallback, useEffect } from "react";
import Loading from "components/Loading";
import { useEditor } from "hook/useBlog";
import { markNOLineNumber } from "utils/markdown";

import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), { ssr: false, loading: () => <Loading color="danger" /> });

const BlogContentMessageMarkdown = ({
  name = "content",
  initContent,
  forwardRef,
}: { name?: string; initContent?: string; forwardRef?: MutableRefObject<HTMLTextAreaElement | null> } = {}) => {
  useEffect(() => {
    if (forwardRef) {
      forwardRef.current = document.querySelector(`#editor_${name}_md`);
      return () => {
        forwardRef.current = null;
      };
    }
  }, []);

  if (process.browser) {
    useEditor(name);
  }

  const mdRender = useCallback((text) => markNOLineNumber.render(text), []);

  return (
    <MdEditor
      style={{ minHeight: "40vh", borderRadius: "3px" }}
      placeholder="请输入内容"
      name={name}
      id={`editor_${name}`}
      defaultValue={initContent}
      renderHTML={mdRender}
    />
  );
};

// use memo to prevent render
export default memo(BlogContentMessageMarkdown);
