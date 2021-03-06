import dynamic from "next/dynamic";
import { useCallback } from "react";
import { useEditor } from "hook/useBlog";
import { getClass } from "utils/dom";
import { markNOLineNumber } from "utils/markdown";
import { BlogContentType } from "types/containers";

import style from "./index.module.scss";
import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

const PublishEditor: BlogContentType = ({ blogId, blogContent = "" }) => {
  if (process.browser) {
    useEditor(blogId!);
  }

  const mdRender = useCallback<(t: string) => string>((text) => markNOLineNumber.render(text), []);

  return (
    <div className={getClass("mb-3", style.editor)}>
      <MdEditor
        name="blogContent"
        id={`editor_${blogId}`}
        defaultValue={blogContent}
        style={{ minHeight: "90vh", borderRadius: "3px" }}
        renderHTML={mdRender}
      />
    </div>
  );
};

export default PublishEditor;
