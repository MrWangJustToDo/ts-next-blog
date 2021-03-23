import LoginContent from "containers/Login";
import ReLoginContent from "containers/ReLogin";
import { animateFadein, flexCenter, getClass } from "utils/class";
import { wrapper } from "store";
import { autoDispatchTockenHandler } from "config/ssr";

type LoginType = ((props: { isLogin: boolean }) => JSX.Element) & { container?: boolean; title?: string };

let Login: LoginType;

Login = ({ isLogin }) => {
  return <div className={getClass("container-md h-100", animateFadein, flexCenter)}>{isLogin ? <ReLoginContent /> : <LoginContent />}</div>;
};

Login.container = false;

Login.title = "登录";

// 判断是否已经登录
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ req }) => ({
    props: {
      isLogin: !!req.session["userCache"],
    },
  }))
);

export default Login;
