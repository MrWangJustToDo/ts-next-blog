import TagHead from "./tagHead";
import TagFoot from "./tagFoot";
import TagContent from "./tagContent";
import LoadRender from "components/LoadRender";
import { useHome } from "hook/useHome";
import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";
import { SimpleElement } from "types/components";

const Tag: SimpleElement = () => {
  const { blogs } = useHome();

  return (
    <>
      <TagHead />
      <div className="card mx-lg-4 mt-4">
        <LoadRender<BlogContentProps[]>
          needUpdate
          needinitialData
          initialData={blogs}
          apiPath={apiName.home}
          revalidateOnFocus={false}
          loaded={(data) => {
            return (
              <>
                <TagContent blogs={data} />
                <TagFoot blogs={data} />
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default Tag;
