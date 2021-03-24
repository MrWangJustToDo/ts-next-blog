import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import DeleteTag from './manageDeleteTagItem';
import { SimpleElement } from "types/components";
import { TagProps } from "types/containers";

let ManageTag: SimpleElement;

ManageTag = () => {
  return (
    <div className="card-body">
      <LoadRender<TagProps[]>
        needUpdate
        needinitialData
        apiPath={apiName.tag}
        loaded={(data) => {
          return (
            <>
              {data.map(({ tagCount, tagContent, tagId }) => (
                <div key={tagId} className="d-inline-block">
                  <DeleteTag {...{ tagContent, tagCount, tagId }} />
                </div>
              ))}
            </>
          );
        }}
      />
    </div>
  );
};

export default ManageTag;
