import { wrapper } from "store";
import { NotLogin } from "containers/NotLogin";
import { Publish as PublishContent } from "containers/Publish";
import { animateFadeIn, getClass } from "utils/dom";
import { autoDispatchTokenHandler } from "config/ssr";
import { MyNextComponent } from "./_app";

const Publish: MyNextComponent<{ isLogin: boolean }> = ({ isLogin }) => {
  return <div className={getClass(animateFadeIn, "container-md my-5")}>{isLogin ? <PublishContent /> : <NotLogin />}</div>;
};

Publish.title = "发布";

// 判断是否已经登录
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ req }) => ({
    props: {
      isLogin: !!req.session["userCache"],
    },
  }))
);

export default Publish;
