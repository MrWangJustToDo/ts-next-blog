import { wrapper } from "store";
import { MyNextComponent } from "./_app";
import { NotLogin } from "containers/NotLogin";
import { Manage as ManageContent } from "containers/Manage";
import { autoDispatchTokenHandler } from "config/ssr";
import { animateFadeIn, getClass } from "utils/dom";

const Manage: MyNextComponent<{ isLogin: boolean; userId: string }> = ({ isLogin, userId }) => {
  return <div className={getClass(animateFadeIn, "container-md my-5")}>{isLogin ? <ManageContent userId={userId} /> : <NotLogin />}</div>;
};

Manage.title = "管理";

// 判断是否已经登录
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTokenHandler(async ({ req }) => ({
    props: {
      isLogin: !!req.session["userCache"],
      userId: req.session["userCache"]?.userId || null,
    },
  }))
);

export default Manage;
