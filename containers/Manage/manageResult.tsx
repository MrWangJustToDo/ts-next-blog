import { useEffect } from "react";
import LoadRender from "components/LoadRender";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { animateFadeIn, getClass } from "utils/dom";
import ManageResultAll from "./manageResultAll";
import ManageResultSearch from "./manageResultSearch";
import { useBool } from "hook/useData";
import { useCurrentState } from "hook/useBase";
import { BlogContentProps } from "types/hook";
import { ManageUserIdType } from "types/containers";

import style from "./index.module.scss";

type Result = {
  loading: boolean;
  data: BlogContentProps[];
};

const ManageResult: ManageUserIdType = ({ userId }) => {
  const { bool, switchBoolDebounce, show } = useBool();

  const { state } = useCurrentState<Result>((state) => state.client[actionName.currentResult]);

  const data = (state as Result)["data"];

  const loading = (state as Result)["loading"];

  useEffect(() => {
    if (!loading && data) {
      show();
    }
  }, [loading, data]);

  return (
    <div className="card mt-4">
      <div className="card-header">
        {!bool ? "所有数据" : "搜索结果"}
        <a className={getClass("small text-info float-right", style.swatchLink)} onClick={switchBoolDebounce}>
          <span>{!bool ? "去到搜索" : "去到所有"}</span>
        </a>
      </div>
      {!bool ? (
        <LoadRender<BlogContentProps[]>
          token
          needUpdate
          needInitialData
          revalidateOnFocus={false}
          apiPath={apiName.userHome}
          query={{ userId }}
          loaded={(data) => (
            <div className={getClass(animateFadeIn)}>
              <ManageResultAll {...data} />
            </div>
          )}
        />
      ) : (
        <div className={getClass(animateFadeIn)}>
          <ManageResultSearch data={data} loading={loading} />
        </div>
      )}
    </div>
  );
};

export default ManageResult;
