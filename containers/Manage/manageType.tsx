import { Type } from "components/Type";
import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import { SimpleElement } from "types/components";
import { TypeProps } from "types/hook";

let ManageType: SimpleElement;

ManageType = () => {
  return (
    <div className="card-body">
      <LoadRender<TypeProps[]>
        needUpdate
        needinitialData
        apiPath={apiName.type}
        loaded={(data) => {
          return (
            <>
              {data.map(({ typeId, typeContent, typeCount }) => (
                <div key={typeId} className="m-1">
                  <Type typeCount={typeCount!} typeContent={typeContent!} />
                </div>
              ))}
            </>
          );
        }}
      />
    </div>
  );
};

export default ManageType;
