import { Drop } from "components/Drop";
import { Button } from "components/Button";
import { LoadRender } from "components/LoadRender";
import { useSearch } from "hook/useManage";
import { apiName } from "config/api";
import { DropItemProps, SimpleElement } from "types/components";
import { ServerTagProps, TypeProps } from "types";

export const ManageSearch: SimpleElement = () => {
  const [ref, search] = useSearch();

  return (
    <div className="card">
      <form className="form-inline p-3" ref={ref}>
        <input type="text" className="form-control m-2" placeholder="标题" name="blogTitle" />
        <LoadRender<TypeProps[]>
          needUpdate
          needInitialData
          apiPath={apiName.type}
          loaded={(res) => {
            const data: DropItemProps<string>[] = res.map(({ typeContent, typeId }) => ({ name: typeContent, value: typeId! }));
            return <Drop<string> _style={{ zIndex: "3" }} fieldName="typeId" className="form-control m-2" placeHolder="选择分类" data={data} />;
          }}
        />
        <LoadRender<ServerTagProps[]>
          needUpdate
          needInitialData
          apiPath={apiName.tag}
          loaded={(res) => {
            const data: DropItemProps<string>[] = res.map(({ tagContent, tagId }) => ({ name: tagContent, value: tagId! }));
            return <Drop<string> fieldName="tagId" className="form-control m-2" placeHolder="选择标签" data={data} multiple />;
          }}
        />
        <Button className="btn-primary m-2" request={search} value={"搜索"} loadingColor="light" />
      </form>
    </div>
  );
};
