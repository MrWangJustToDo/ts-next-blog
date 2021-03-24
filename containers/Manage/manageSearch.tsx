import { useMemo } from "react";
import Drop from "components/Drop";
import Button from "components/Button";
import LoadRender from "components/LoadRender";
import { useSearch } from "hook/useManage";
import { createRequest } from "utils/fetcher";
import { apiName } from "config/api";
import { TypeProps } from "types/hook";
import { DropItemProps, SimpleElement } from "types/components";
import { TagProps } from "types/containers";

let ManageSearch: SimpleElement;

ManageSearch = () => {
  const request = useMemo(() => createRequest({ method: "post", header: { apiToken: true } }), []);
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
            const data: DropItemProps<string>[] = res.map(({ typeContent, typeId }) => ({ name: typeContent, value: typeId! }));
            return <Drop<string> fieldName="typeId" className="form-control m-2" placeHolder="选择分类" data={data} />;
          }}
        />
        <LoadRender<TagProps[]>
          needUpdate
          needinitialData
          apiPath={apiName.tag}
          loaded={(res) => {
            const data: DropItemProps<string>[] = res.map(({ tagContent, tagId }) => ({ name: tagContent, value: tagId! }));
            return <Drop<string> fieldName="tagId" className="form-control m-2" placeHolder="选择标签" data={data} multiple />;
          }}
        />
        <Button className="btn-primary m-2" request={search} value={"搜索"} />
      </form>
    </div>
  );
};

export default ManageSearch;
