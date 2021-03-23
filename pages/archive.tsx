import { wrapper } from "store";
import { END } from "redux-saga";
import groupBy from "lodash/groupBy";
import ArchiveContent from "containers/Archive";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { autoDispatchTockenHandler } from "config/ssr";
import { animateFadein, getClass } from "utils/class";
import { setDataSucess_client } from "store/reducer/client/action";
import { getDataAction_Server, getDataSucess_Server } from "store/reducer/server/action";

let Archive: MyNextComponent;

Archive = () => {
  return (
    <div className={getClass(animateFadein, "container-md my-5")}>
      <ArchiveContent />
    </div>
  );
};

Archive.title = "归档";

export default Archive;

export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.home }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // add home state
    store.dispatch(getDataSucess_Server({ name: apiName.home, data: store.getState().server[apiName.home]["data"] }));
    // 当前页面需要的数据{'2020': [...], '2021': [....]}
    const blogs = store.getState().server[apiName.home]["data"];
    const groupBlogs = groupBy(blogs, "blogCreateYear");
    store.dispatch(setDataSucess_client({ name: actionName.currentArchive, data: groupBlogs }));
  })
);
