import { wrapper } from "store";
import { END } from "redux-saga";
import { Type as TypeContent } from "containers/Type";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, getClass } from "utils/dom";
import { getDataAction_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

const Type: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadeIn, "container-md my-5")}>
      <TypeContent />
    </div>
  );
};

Type.title = "分类";

export default Type;

// 加载type页面数据
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.type }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // dispatch action to change type state
    store.dispatch(getDataSuccess_Server({ name: apiName.type, data: store.getState().server[apiName.type]["data"] }));
  })
);
