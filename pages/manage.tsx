import { wrapper } from "store";
import NotLogin from "containers/NotLogin";
import ManageContent from "containers/Manage";
import { autoDispatchTockenHandler } from "config/ssr";
import { animateFadein, getClass } from "utils/class";

type ManageType = ((props: { isLogin: boolean; userId: string }) => JSX.Element) & { title?: string };

let Manage: ManageType;

Manage = ({ isLogin, userId }) => {
  return <div className={getClass(animateFadein, "container-md my-5")}>{isLogin ? <ManageContent userId={userId} /> : <NotLogin />}</div>;
};

Manage.title = "管理";

// 判断是否已经登录
export const getServerSideProps = wrapper.getServerSideProps(
  autoDispatchTockenHandler(async ({ req }) => ({
    props: {
      isLogin: !!req.session["userCache"],
      userId: req.session["userCache"].userId,
    },
  }))
);

export default Manage;
