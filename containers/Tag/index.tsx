import { TagHead } from "./tagHead";
import { TagFoot } from "./tagFoot";
import { TagContent } from "./tagContent";
import { LoadRender } from "components/LoadRender";
import { useHome } from "hook/useHome";
import { apiName } from "config/api";
import { SimpleElement } from "types/components";
import { HomeProps } from "store/reducer/server/action/home";

export const Tag: SimpleElement = () => {
  const { blogs } = useHome();

  return (
    <>
      <TagHead />
      <div className="card mx-lg-4 mt-4">
        <LoadRender<HomeProps>
          needUpdate
          needInitialData
          initialData={blogs}
          apiPath={apiName.home}
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
