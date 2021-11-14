import { Drop } from "components/Drop";
import { blogOrigin } from "config/publish";
import { BlogProps } from "types";

export const PublishHead = ({ blogOriginState, blogTitle }: Partial<Pick<BlogProps, "blogOriginState" | "blogTitle">>) => {
  return (
    <div className="input-group mb-3">
      <Drop<string>
        fieldName="blogOriginState"
        className="col-1 border-info rounded-left"
        data={blogOrigin}
        initData={blogOriginState !== undefined ? [blogOriginState] : []}
      />
      <input type="text" className="form-control shadow-none col-11" placeholder="标题" name="blogTitle" defaultValue={blogTitle} />
    </div>
  );
};
