import { apiName } from "config/api";
import { PublishHead as EditorHead } from "components/Publish/publishHead";
import { PublishEditor as EditorEditor } from "components/Publish/publishEditor";
import { PublishTypeAndTag as EditorTypeTag } from "components/Publish/publishTypeAndTag";
import { PublishImage as EditorImage } from "containers/Publish/publishImage";
import { PublishState as EditorState } from "components/Publish/publishState";
import { EditorSubmit } from "./editorSubmit";
import { useUserRequest } from "hook/useUser";
import { useUpdateBlog } from "hook/useBlog";
import { BlogProps, ClientTagProps, TypeProps, UserProps } from "types";

export const Editor = (props: BlogProps & UserProps & TypeProps & ClientTagProps) => {
  const request = useUserRequest({ method: "post", apiPath: apiName.updateBlog, header: { apiToken: true }, data: { oldProps: props }, cache: false });

  const [ref, submit] = useUpdateBlog({ request, id: props.blogId! });

  return (
    <div className="card mx-lg-4 border-0">
      <form ref={ref}>
        <EditorHead blogOriginState={props.blogOriginState} blogTitle={props.blogTitle} />
        <EditorEditor blogId={props.blogId} blogContent={props.blogContent} />
        <EditorTypeTag typeId={props.typeId} tagId={props.tagId} />
        <EditorImage blogImgLink={props.blogImgLink} />
        <EditorState blogState={props.blogState} blogPriseState={props.blogPriseState} blogCommentState={props.blogCommentState} />
        <EditorSubmit submit={submit} />
      </form>
    </div>
  );
};
