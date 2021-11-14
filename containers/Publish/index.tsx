import { useMemo } from "react";
import { apiName } from "config/api";
import { editorId } from "config/publish";
import { usePublish } from "hook/useBlog";
import { createRequest } from "utils/fetcher";
import { PublishHead } from "components/Publish/publishHead";
import { PublishState } from "components/Publish/publishState";
import { PublishEditor } from "components/Publish/publishEditor";
import { PublishTypeAndTag } from "components/Publish/publishTypeAndTag";
import { PublishImage } from "./publishImage";
import { PublishSubmit } from "./publishSubmit";
import { SimpleElement } from "types/components";

export const Publish: SimpleElement = () => {
  const request = useMemo(() => createRequest({ method: "post", apiPath: apiName.publishBlog, header: { apiToken: true }, cache: false }), []);

  const [ref, submit] = usePublish({ request, id: editorId });

  return (
    <div className="card mx-lg-4 border-0">
      <form ref={ref}>
        <PublishHead />
        <PublishEditor blogId={editorId} />
        <PublishTypeAndTag />
        <PublishImage />
        <PublishState />
        <PublishSubmit submit={submit} />
      </form>
    </div>
  );
};
