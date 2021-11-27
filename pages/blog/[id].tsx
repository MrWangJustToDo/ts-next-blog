import { wrapper } from "store";
import { END } from "redux-saga";
import { Blog } from "containers/Blog";
import { BlogUtils } from "components/BlogUtils";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, getClass } from "utils/dom";
import { MyNextComponent } from "pages/_app";
import { BlogProps, ClientTagProps, TypeProps, UserProps } from "types";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { getDataAction_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

const BlogContent: MyNextComponent<{ blogContent: BlogProps & TypeProps & ClientTagProps & UserProps }> = ({ blogContent }) => {
  return (
    <>
      <div className={getClass(animateFadeIn, "container-md my-5")}>
        <Blog {...blogContent} />
      </div>
      <BlogUtils />
    </>
  );
};

BlogContent.title = "博客";

export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ store, ...etc }) => {
    // 获取当前需要加载的博客详细信息
    const {
      params: { id },
    } = etc;
    store.dispatch(setDataSuccess_client({ name: actionName.currentBlogId, data: id }));
    store.dispatch(getDataAction_Server({ name: apiName.blog }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    store.dispatch(getDataSuccess_Server({ name: apiName.blog, data: { [id]: store.getState().server[apiName.blog]["data"][id] } }));
    return { props: { blogContent: store.getState().server[apiName.blog]["data"][id] } };
  })
);

export default BlogContent;
