import TypeHead from "./typeHead";
import TypeContent from "./typeContent";
import TypeFoot from "./typeFoot";
import LoadRender from "components/LoadRender";
import { useHome } from "hook/useHome";
import { apiName } from "config/api";
import { BlogContentProps } from "types/hook";
import { SimpleElement } from "types/components";

let Type: SimpleElement;

Type = () => {
  const { blogs } = useHome();
  return (
    <>
      <TypeHead />
      <div className="card mx-lg-4 mt-4">
        <LoadRender<BlogContentProps[]>
          apiPath={apiName.home}
          initialData={blogs}
          loaded={(data) => {
            return (
              <>
                <TypeContent blogs={data} />
                <TypeFoot blogs={data} />
              </>
            );
          }}
        />
      </div>
    </>
  );
};

export default Type;
