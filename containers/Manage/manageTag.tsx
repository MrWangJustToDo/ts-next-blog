import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import DeleteTag from './manageDeleteTagItem';
import { TagProps } from "containers/Publish/@type";
import { SimpleElement } from "containers/Main/@type";

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
