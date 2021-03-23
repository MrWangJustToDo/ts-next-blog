import dynamic from "next/dynamic";
import { useEditor } from "hook/useBlog";
import { getClass } from "utils/class";
import { markNOLineNumber } from "utils/markdown";
import { PublishEditorType } from "types/containers";

import style from "./index.module.scss";
import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
});

let PublishEditor: PublishEditorType;

PublishEditor = ({ id }) => {
  if (process.browser) {
    useEditor(id);
  }
  return (
    <div className={getClass("mb-3", style.editor)}>
      <MdEditor id={id} name="blogContent" renderHTML={(text) => markNOLineNumber.render(text)} style={{ minHeight: "90vh", borderRadius: "3px" }} />
    </div>
  );
};

export default PublishEditor;
