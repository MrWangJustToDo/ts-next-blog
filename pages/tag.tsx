import { wrapper } from "store";
import { END } from "redux-saga";
import TagContent from "containers/Tag";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { autoDispatchTockenHandler } from "config/ssr";
import { animateFadein, getClass } from "utils/dom";
import { getDataAction_Server, getDataSucess_Server } from "store/reducer/server/action";

const Tag: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadein, "container-md my-5")}>
      <TagContent />
    </div>
  );
};

Tag.title = "标签";

export default Tag;

// 加载tag页面数据
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.tag }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // dispacth action to change tag state
    store.dispatch(getDataSucess_Server({ name: apiName.tag, data: store.getState().server[apiName.tag]["data"] }));
  })
);
