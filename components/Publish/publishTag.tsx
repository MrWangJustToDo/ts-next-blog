import { apiName } from "config/api";
import { Drop } from "components/Drop";
import { LoadRender } from "components/LoadRender";
import { ClientTagProps, ServerTagProps } from "types";

export const PublishTag = ({ tagId }: Partial<Pick<ClientTagProps, "tagId">>) => {
  return (
    <div className="input-group col">
      <div className="input-group-prepend text-center">
        <span
          className="d-inline-block input-group-text bg-transparent border-info text-info position-relative font-weight-bold"
          style={{ zIndex: 12, minWidth: "60px" }}
        >
          标签
        </span>
      </div>
      <LoadRender<ServerTagProps[]>
        needInitialData
        apiPath={apiName.tag}
        loaded={(res) => {
          const data: { name?: string; value: string }[] = res.map(({ tagContent, tagId }) => {
            return { name: tagContent, value: tagId! };
          });
          const init = tagId !== undefined && data.length ? tagId.map((it) => data.findIndex(({ value }) => value === it)) : [];
          return <Drop<string> fieldName="tagId" className="form-control" placeHolder="添加标签" data={data} multiple initData={init} />;
        }}
      />
    </div>
  );
};
