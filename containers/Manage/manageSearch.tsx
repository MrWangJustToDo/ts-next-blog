import Drop from "components/Drop";
import Button from "components/Button";
import LoadRender from "components/LoadRender";
import { useSearch } from "hook/useManage";
import { autoRequest } from "utils/fetcher";
import { apiName } from "config/api";
import { TypeProps } from "hook/@type";
import { TagProps } from "containers/Publish/@type";
import { DropItemProps } from "components/Drop/@type";
import { SimpleElement } from "containers/Main/@type";

let ManageSearch: SimpleElement;

ManageSearch = () => {
  const request = autoRequest({ method: "post", token: true });
  const [ref, search] = useSearch({ request });
  return (
    <div className="card">
      <form className="form-inline p-3" ref={ref}>
        <input type="text" className="form-control m-2" placeholder="标题" name="title" />
        <LoadRender<TypeProps[]>
          needUpdate
          needinitialData
          apiPath={apiName.type}
          loaded={(res) => {
            const data: DropItemProps<string>[] = res.map(({ typeContent, typeId }) => ({ name: typeContent, value: typeId }));
            return <Drop<string> fieldName="typeId" className="form-control m-2" placeHolder="选择分类" data={data} />;
          }}
        />
        <LoadRender<TagProps[]>
          needUpdate
          needinitialData
          apiPath={apiName.tag}
          loaded={(res) => {
            const data: DropItemProps<string>[] = res.map(({ tagContent, tagId }) => ({ name: tagContent, value: tagId }));
            return <Drop<string> fieldName="tagId" className="form-control m-2" placeHolder="选择标签" data={data} multiple />;
          }}
        />
        <Button className="btn-primary m-2" request={search} value={"搜索"} />
      </form>
    </div>
  );
};

export default ManageSearch;
