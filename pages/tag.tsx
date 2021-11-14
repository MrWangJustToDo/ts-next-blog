import { wrapper } from "store";
import { END } from "redux-saga";
import { Tag as TagContent } from "containers/Tag";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, getClass } from "utils/dom";
import { getDataAction_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

const Tag: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadeIn, "container-md my-5")}>
      <TagContent />
    </div>
  );
};

Tag.title = "标签";

export default Tag;

// 加载tag页面数据
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.tag }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // dispatch action to change tag state
    store.dispatch(getDataSuccess_Server({ name: apiName.tag, data: store.getState().server[apiName.tag]["data"] }));
  })
);
