import { wrapper } from "store";
import NotLogin from "containers/NotLogin";
import PublishContent from "containers/Publish";
import { animateFadein, getClass } from "utils/class";
import { autoDispatchTockenHandler } from "config/ssr";

type PublishType = ((props: { isLogin: boolean }) => JSX.Element) & { title?: string };

const Publish: PublishType = ({ isLogin }) => {
  return <div className={getClass(animateFadein, "container-md my-5")}>{isLogin ? <PublishContent /> : <NotLogin />}</div>;
};

Publish.title = "发布";

// 判断是否已经登录
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ req }) => ({
    props: {
      isLogin: !!req.session["userCache"],
    },
  }))
);

export default Publish;
