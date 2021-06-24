import Drop from "components/Drop";
import { blogOrigin } from "config/publish";
import { BlogContentType } from "types/containers";

const PublishHead: BlogContentType = ({ blogOriginState, blogTitle }) => {
  return (
    <div className="input-group mb-3">
      <Drop<string>
        fieldName="blogOriginState"
        className="col-1 border-info rounded-left"
        data={blogOrigin}
        initData={blogOriginState ? [blogOriginState] : []}
      />
      <input type="text" className="form-control shadow-none col-11" placeholder="标题" name="blogTitle" defaultValue={blogTitle} />
    </div>
  );
};

export default PublishHead;
