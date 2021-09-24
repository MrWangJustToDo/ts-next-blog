import Drop from "components/Drop";
import CheckBox from "components/CheckBox";
import { blogState } from "config/publish";
import { BlogContentType } from "types/containers";

const PublishState: BlogContentType = (props) => {
  return (
    <>
      {blogState.map(({ fieldName, name, value }, idx) => {
        if (Array.isArray(value)) {
          const init = props[fieldName] !== undefined ? [props[fieldName]].map((it) => value.findIndex(({ value: subValue }) => subValue === String(it))) : [];
          return (
            <div key={idx} className="form-check form-check-inline mr-4">
              <span className="mr-lg-2 mr-1">{name}</span>
              <Drop<string> fieldName={fieldName} data={value} className="rounded" _style={{ minWidth: "120px", zIndex: "1" }} initData={init} />
            </div>
          );
        } else {
          const init = Boolean(props[fieldName]);
          return (
            <div key={idx} className="form-check form-check-inline mr-4">
              <span className="mr-lg-2 mr-1">{name ? name : value}</span>
              <CheckBox fieldName={fieldName} initState={init} />
            </div>
          );
        }
      })}
    </>
  );
};

export default PublishState;
