import { apiName } from "config/api";
import { LoadRender } from "components/LoadRender";
import { ManageDeleteTypeItem } from "./manageDeleteTypeItem";
import { SimpleElement } from "types/components";
import { TypeProps } from "types";

export const ManageType: SimpleElement = () => {
  return (
    <div className="card-body">
      <LoadRender<TypeProps[]>
        needUpdate
        needInitialData
        apiPath={apiName.type}
        loaded={(data) => {
          return (
            <>
              {data.map(({ typeId, typeContent, typeCount, typeState }) => (
                <div key={typeId} className="d-inline-block">
                  <ManageDeleteTypeItem {...{ typeId, typeContent, typeCount, typeState }} />
                </div>
              ))}
            </>
          );
        }}
      />
    </div>
  );
};
