import { wrapper } from "store";
import { END } from "redux-saga";
import Main from "containers/Main";
import { MyNextComponent } from "./_app";
import { apiName } from "config/api";
import { autoDispatchTockenHandler } from "config/ssr";
import { animateFadein, getClass } from "utils/dom";
import { getDataAction_Server, getDataSucess_Server } from "store/reducer/server/action";

const Home: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadein, "container-md my-5")}>
      <Main />
    </div>
  );
};

Home.title = "首页";

export default Home;

// 加载home页面数据
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ store }) => {
    // action
    store.dispatch(getDataAction_Server({ name: apiName.home }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    // dispatch action to change state
    store.dispatch(getDataSucess_Server({ name: apiName.home, data: store.getState().server[apiName.home]["data"] }));
  })
);
