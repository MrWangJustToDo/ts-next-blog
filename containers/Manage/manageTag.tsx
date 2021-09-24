import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import DeleteTag from "./manageDeleteTagItem";
import { SimpleElement } from "types/components";
import { TagProps } from "types/containers";

const ManageTag: SimpleElement = () => {
  return (
    <div className="card-body">
      <LoadRender<TagProps[]>
        needUpdate
        needInitialData
        apiPath={apiName.tag}
        revalidateOnFocus={false}
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
