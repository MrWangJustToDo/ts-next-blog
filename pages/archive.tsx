import { wrapper } from "store";
import { END } from "redux-saga";
import groupBy from "lodash/groupBy";
import { Archive as ArchiveContent } from "containers/Archive";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, getClass } from "utils/dom";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { getDataAction_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

const Archive: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadeIn, "container-md my-5")}>
      <ArchiveContent />
    </div>
  );
};

Archive.title = "归档";

export default Archive;

export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.home }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // add home state
    store.dispatch(getDataSuccess_Server({ name: apiName.home, data: store.getState().server[apiName.home]["data"] }));
    // 当前页面需要的数据{'2020': [...], '2021': [....]}
    const blogs = store.getState().server[apiName.home]["data"];
    const groupBlogs = groupBy(blogs, "blogCreateYear");
    store.dispatch(setDataSuccess_client({ name: actionName.currentArchive, data: groupBlogs }));
  })
);
