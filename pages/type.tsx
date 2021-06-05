import { wrapper } from "store";
import { END } from "redux-saga";
import TypeContent from "containers/Type";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { autoDispatchTockenHandler } from "config/ssr";
import { animateFadein, getClass } from "utils/dom";
import { getDataAction_Server, getDataSucess_Server } from "store/reducer/server/action";

const Type: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadein, "container-md my-5")}>
      <TypeContent />
    </div>
  );
};

Type.title = "分类";

export default Type;

// 加载type页面数据
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.type }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // dispatch action to change type state
    store.dispatch(getDataSucess_Server({ name: apiName.type, data: store.getState().server[apiName.type]["data"] }));
  })
);
