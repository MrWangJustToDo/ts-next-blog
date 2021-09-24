import { wrapper } from "store";
import LoginContent from "containers/Login";
import ReLoginContent from "containers/ReLogin";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, flexCenter, getClass } from "utils/dom";

type LoginType = ((props: { isLogin: boolean }) => JSX.Element) & { container?: boolean; title?: string };

const Login: LoginType = ({ isLogin }) => {
  return <div className={getClass("container-md h-100", animateFadeIn, flexCenter)}>{isLogin ? <ReLoginContent /> : <LoginContent />}</div>;
};

Login.container = false;

Login.title = "登录";

// 判断是否已经登录
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ req }) => ({
    props: {
      isLogin: req.session["userCache"],
    },
  }))
);

export default Login;
