import Drop from "components/Drop";
import { blogOrigin } from "config/publish";
import { SimpleElement } from "types/components";

let PublishHead: SimpleElement;

PublishHead = () => {
  return (
    <div className="input-group mb-3">
      <Drop<number> fieldName="blogOriginState" className="col-1 border-info rounded-left" data={blogOrigin} />
      <input type="text" className="form-control shadow-none col-11" placeholder="标题" name="blogTitle" />
    </div>
  );
};

export default PublishHead;
