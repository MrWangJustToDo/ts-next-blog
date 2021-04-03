import { wrapper } from "store";
import { END } from "redux-saga";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { autoDispatchTockenHandler } from "config/ssr";
import Editor from "containers/Editor";
import { setDataSucess_client } from "store/reducer/client/action";
import { getDataAction_Server, getDataSucess_Server } from "store/reducer/server/action";
import { BlogContentType } from "types/containers";
import { animateFadein, getClass } from "utils/class";

let EditorContent: BlogContentType & { title?: string };

EditorContent = (props) => {
  return (
    <div className={getClass("container-md my-5", animateFadein)}>
      <Editor {...props} />
    </div>
  );
};

EditorContent.title = "编辑";

export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ store, ...etc }) => {
    // 获取当前需要加载的博客详细信息
    const {
      params: { id },
    } = etc;
    store.dispatch(setDataSucess_client({ name: actionName.currentBlogId, data: id }));
    // 加载数据并且存储在session中
    store.dispatch(getDataAction_Server({ name: apiName.blog }));
    // end the saga
    store.dispatch(END);
    // wait saga end
    await store.sagaTask?.toPromise();
    store.dispatch(getDataSucess_Server({ name: apiName.blog, data: { [id]: store.getState().server[apiName.blog]["data"][id] } }));
    return { props: store.getState().server[apiName.blog]["data"][id] };
  })
);

export default EditorContent;
