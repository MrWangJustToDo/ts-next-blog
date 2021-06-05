import { wrapper } from "store";
import { END } from "redux-saga";
import Blog from "containers/Blog";
import BlogUtils from "components/BlogUtils";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { autoDispatchTockenHandler } from "config/ssr";
import { animateFadein, getClass } from "utils/dom";
import { setDataSucess_client } from "store/reducer/client/action";
import { getDataAction_Server, getDataSucess_Server } from "store/reducer/server/action";
import { BlogContentType } from "types/containers";

const BlogContent: BlogContentType & { title?: string } = (props) => {
  return (
    <>
      <div className={getClass(animateFadein, "container-md my-5")}>
        <Blog {...props} />
      </div>
      <BlogUtils />
    </>
  );
};

BlogContent.title = "博客";

export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ store, ...etc }) => {
    // 获取当前需要加载的博客详细信息
    const {
      params: { id },
    } = etc;
    store.dispatch(setDataSucess_client({ name: actionName.currentBlogId, data: id }));
    store.dispatch(getDataAction_Server({ name: apiName.blog }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    store.dispatch(getDataSucess_Server({ name: apiName.blog, data: { [id]: store.getState().server[apiName.blog]["data"][id] } }));
    return { props: store.getState().server[apiName.blog]["data"][id] };
  })
);

export default BlogContent;
