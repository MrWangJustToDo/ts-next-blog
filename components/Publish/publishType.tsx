import Drop from "components/Drop";
import LoadRender from "components/LoadRender";
import { apiName } from "config/api";
import { TypeProps } from "types/hook";
import { BlogContentType } from "types/containers";

const PublishType: BlogContentType = ({ typeId }) => {
  return (
    <div className="input-group col">
      <div className="input-group-prepend text-center">
        <span
          className="d-inline-block input-group-text bg-transparent border-info text-info position-relative font-weight-bold"
          style={{ zIndex: 12, minWidth: "60px" }}
        >
          分类
        </span>
      </div>
      <LoadRender<TypeProps[]>
        needInitialData
        apiPath={apiName.type}
        revalidateOnFocus={false}
        loaded={(res) => {
          const data: { name?: string; value: string }[] = res.map(({ typeContent, typeId }) => {
            return { name: typeContent, value: typeId! };
          });
          const init = typeId !== undefined && data.length ? [typeId].map((it) => data.findIndex(({ value }) => value === it)) : [];
          return <Drop<string> maxHeight={200} fieldName="typeId" className="form-control" placeHolder="添加分类" data={data} initData={init} />;
        }}
      />
    </div>
  );
};

export default PublishType;
