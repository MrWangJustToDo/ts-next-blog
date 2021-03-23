import LoadRender from "components/LoadRender";
import { apiName } from "config/api";
import BlogContentPrimaryMessage from "./blogContentMessagePrimary";
import { PrimaryMessageProps } from "types/components";
import { BlogContentMessageType } from "types/containers";

let BlogContentMessage: BlogContentMessageType;

BlogContentMessage = ({ blogId }) => {
  return (
    <li className="list-group-item">
      <div className="card">
        <h5 className="card-header small">留言区</h5>
        <LoadRender<PrimaryMessageProps[]>
          token
          method="post"
          query={{ blogId }}
          requestData={{ blogId }}
          apiPath={apiName.primaryMessage}
          loaded={(data) => <BlogContentPrimaryMessage messages={data} />}
        />
      </div>
    </li>
  );
};

export default BlogContentMessage;
