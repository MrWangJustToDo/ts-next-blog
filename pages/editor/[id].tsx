import { wrapper } from "store";
import { END } from "redux-saga";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, getClass } from "utils/dom";
import Editor from "containers/Editor";
import { setDataSuccess_client } from "store/reducer/client/action";
import { getDataAction_Server, getDataSuccess_Server } from "store/reducer/server/action";
import { BlogContentType } from "types/containers";

const EditorContent: BlogContentType & { title?: string } = (props) => {
  return (
    <div className={getClass("container-md my-5", animateFadeIn)}>
      <Editor {...props} />
    </div>
  );
};

EditorContent.title = "编辑";

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
    return { props: store.getState().server[apiName.blog]["data"][id] };
  })
);

export default EditorContent;
