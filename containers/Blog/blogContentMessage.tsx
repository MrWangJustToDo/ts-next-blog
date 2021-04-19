import LoadRender from "components/LoadRender";
import { apiName } from "config/api";
import BlogContentPrimaryMessage from "./blogContentMessagePrimary";
import { PrimaryMessageProps } from "types/components";
import { BlogContentMessageType } from "types/containers";
import { flexCenter, getClass } from "utils/class";

let BlogContentMessage: BlogContentMessageType;

BlogContentMessage = ({ blogId }) => {
  return (
    <li className="list-group-item">
      <div className="card">
        <h5 className="card-header small">留言区</h5>
        <LoadRender<PrimaryMessageProps[]>
          token
          query={{ blogId }}
          apiPath={apiName.primaryMessage}
          loaded={(data) =>
            data.length ? <BlogContentPrimaryMessage messages={data.reverse()} /> : <div className={getClass("p-5 text-danger", flexCenter)}>暂时没有留言</div>
          }
        />
      </div>
    </li>
  );
};

export default BlogContentMessage;
