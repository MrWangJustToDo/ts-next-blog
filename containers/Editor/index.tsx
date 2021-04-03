import { useUserRequest } from "hook/useUser";
import { BlogContentType } from "types/containers";
import PublishHead from "components/Publish/publishHead";
import PublishEditor from "components/Publish/publishEditor";
import PublishTypeTag from "components/Publish/publishType&Tag";
import PublishImage from "containers/Publish/publishImage";
import PublishState from "components/Publish/publishState";

let Editor: BlogContentType;

Editor = (props) => {
  const request = useUserRequest({ method: "post", header: { apiToken: true }, data: { oldProps: props } });

  return (
    <div className="card mx-lg-4 border-0">
      <form>
        <PublishHead blogOriginState={props.blogOriginState} blogTitle={props.blogTitle} />
        <PublishEditor blogId={props.blogId} blogContent={props.blogContent} />
        <PublishTypeTag typeId={props.typeId} tagId={props.tagId} />
        <PublishImage blogImgLink={props.blogImgLink} />
        <PublishState {...props} />
      </form>
    </div>
  );
};

export default Editor;
