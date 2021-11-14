import { useEffect } from "react";
import { LoadRender } from "components/LoadRender";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { animateFadeIn, getClass } from "utils/dom";
import { ManageResultAll } from "./manageResultAll";
import { ManageResultSearch } from "./manageResultSearch";
import { useBool } from "hook/useData";
import { useCurrentState } from "hook/useBase";
import { ClientTagProps, HomeBlogProps, TypeProps, UserProps } from "types";

import style from "./index.module.scss";

export const ManageResult = ({ userId }: { userId: string }) => {
  const { bool, switchBoolDebounce, show } = useBool();

  const { state } = useCurrentState((state) => state.client[actionName.currentResult]);

  const data = state["data"];

  const loading = state["loading"];

  useEffect(() => {
    if (!loading && data) {
      show();
    }
  }, [loading, data, show]);

  return (
    <div className="card mt-4">
      <div className="card-header">
        {!bool ? "所有数据" : "搜索结果"}
        <a className={getClass("small text-info float-right", style.swatchLink)} onClick={switchBoolDebounce}>
          <span>{!bool ? "去到搜索" : "去到所有"}</span>
        </a>
      </div>
      {!bool ? (
        <LoadRender<Array<HomeBlogProps & UserProps & TypeProps & ClientTagProps>>
          token
          needUpdate
          needInitialData
          apiPath={apiName.userHome}
          query={{ userId }}
          loaded={(data) => (
            <div className={getClass(animateFadeIn)}>
              <ManageResultAll data={data} />
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
