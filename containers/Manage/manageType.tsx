import { Type } from "components/Type";
import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import { TypeProps } from "hook/@type";
import { SimpleElement } from "containers/Main/@type";

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
                  <Type {...{ typeCount, typeContent }} />
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
