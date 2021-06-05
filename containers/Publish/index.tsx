import { useMemo } from "react";
import { usePublish } from "hook/useBlog";
import { createRequest } from "utils/fetcher";
import { editorId } from "config/publish";
import PublishHead from "components/Publish/publishHead";
import PublishEditor from "components/Publish/publishEditor";
import PublishTypeTag from "components/Publish/publishType&Tag";
import PublishState from "components/Publish/publishState";
import PublishImage from "./publishImage";
import PublishSubmit from "./publishSubmit";
import { SimpleElement } from "types/components";

const Publish: SimpleElement = () => {
  const request = useMemo(() => createRequest({ method: "post", header: { apiToken: true } }), []);

  const [ref, submit] = usePublish({ request, id: editorId });

  return (
    <div className="card mx-lg-4 border-0">
      <form ref={ref}>
        <PublishHead />
        <PublishEditor blogId={editorId} />
        <PublishTypeTag />
        <PublishImage />
        <PublishState />
        <PublishSubmit submit={submit} />
      </form>
    </div>
  );
};

export default Publish;
