import LoadRender from "components/LoadRender";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { animateFadein, getClass } from "utils/class";
import ManageResultAll from "./manageResultAll";
import ManageResultSearch from "./manageResultSearch";
import { useBool } from "hook/useData";
import { useCurrentState } from "hook/useBase";
import { BlogContentProps } from "types/hook";
import { ManageUserIdType } from "types/containers";

import style from "./index.module.scss";

let ManageResult: ManageUserIdType;

ManageResult = ({ userId }) => {
  const { bool, switchBoolState } = useBool();

  const { state } = useCurrentState();

  const data = state.client[actionName.currentResult]["data"];

  const loading = state.client[actionName.currentResult]["loading"];

  const allData = (
    <LoadRender<BlogContentProps[]>
      token
      needUpdate
      needinitialData
      apiPath={apiName.userHome}
      query={{ userId }}
      loaded={(data) => <ManageResultAll {...data} />}
    />
  );

  const searchData = (
    <div className={getClass(animateFadein)}>
      <ManageResultSearch data={data} loading={loading} />
    </div>
  );

  return (
    <div className="card mt-4">
      <div className="card-header">
        {!bool ? "所有数据" : "搜索结果"}
        <a className={getClass("small text-info float-right", style.swatchLink)} onClick={switchBoolState}>
          <span>{!bool ? "去到搜索" : "去到所有"}</span>
        </a>
      </div>
      {!bool ? allData : searchData}
    </div>
  );
};

export default ManageResult;
