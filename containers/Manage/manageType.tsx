import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import DeleteType from "./manageDeleteTypeItem";
import { SimpleElement } from "types/components";
import { TypeProps } from "types/hook";

const ManageType: SimpleElement = () => {
  return (
    <div className="card-body">
      <LoadRender<TypeProps[]>
        needUpdate
        needinitialData
        apiPath={apiName.type}
        revalidateOnFocus={false}
        loaded={(data) => {
          return (
            <>
              {data.map(({ typeId, typeContent, typeCount }) => (
                <div key={typeId} className="d-inline-block">
                  <DeleteType {...{ typeId, typeContent, typeCount }} />
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
