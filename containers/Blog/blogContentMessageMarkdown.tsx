import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useEditor } from "hook/useBlog";
import { markNOLineNumber } from "utils/markdown";

import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), { ssr: false });

const BlogContentMessageMarkdown = ({ name = "content", initContent }: { name?: string; initContent?: string } = {}) => {
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

export default BlogContentMessageMarkdown;
