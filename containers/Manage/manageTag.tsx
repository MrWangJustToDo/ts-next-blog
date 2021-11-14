import { apiName } from "config/api";
import { LoadRender } from "components/LoadRender";
import { ManageDeleteTagItem } from "./manageDeleteTagItem";
import { SimpleElement } from "types/components";
import { ServerTagProps } from "types";

export const ManageTag: SimpleElement = () => {
  return (
    <div className="card-body">
      <LoadRender<ServerTagProps[]>
        needUpdate
        needInitialData
        apiPath={apiName.tag}
        loaded={(data) => {
          return (
            <>
              {data.map(({ tagCount, tagContent, tagId, tagState }) => (
                <div key={tagId} className="d-inline-block">
                  <ManageDeleteTagItem {...{ tagContent, tagCount, tagId, tagState }} />
                </div>
              ))}
            </>
          );
        }}
      />
    </div>
  );
};
