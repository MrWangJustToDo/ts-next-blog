import EditorHead from "components/Publish/publishHead";
import EditorEditor from "components/Publish/publishEditor";
import EditorTypeTag from "components/Publish/publishType&Tag";
import EditorImage from "containers/Publish/publishImage";
import EditorState from "components/Publish/publishState";
import EditorSubmit from "./editorSubmit";
import { useUserRequest } from "hook/useUser";
import { useUpdateBlog } from "hook/useBlog";
import { BlogContentType } from "types/containers";

let Editor: BlogContentType;

Editor = (props) => {
  const request = useUserRequest({ method: "post", header: { apiToken: true }, data: { oldProps: props } });

  const [ref, submit] = useUpdateBlog({ request, id: props.blogId! });

  return (
    <div className="card mx-lg-4 border-0">
      <form ref={ref}>
        <EditorHead blogOriginState={props.blogOriginState} blogTitle={props.blogTitle} />
        <EditorEditor blogId={props.blogId} blogContent={props.blogContent} />
        <EditorTypeTag typeId={props.typeId} tagId={props.tagId} />
        <EditorImage blogImgLink={props.blogImgLink} />
        <EditorState {...props} />
        <EditorSubmit submit={submit} />
      </form>
    </div>
  );
};

export default Editor;
