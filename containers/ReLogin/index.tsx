import { useCallback } from "react";
import Button from "components/Button";
import { useLogout } from "hook/useUser";
import { useRouter } from "next/dist/client/router";
import { flexBetween, getClass } from "utils/dom";
import { SimpleElement } from "types/components";

const ReLogin: SimpleElement = () => {
  const logout = useLogout();

  const router = useRouter();

  const reLogin = useCallback(() => logout().then(router.reload).catch(router.reload), [router, logout]);

  return (
    <div className="jumbotron my-5">
      <h1 className="display-4">访问错误！</h1>
      <p className="lead">当前已经是登录状态，不能重复登录！</p>
      <hr className="my-4" />
      <p>点击下面按钮返回，或者点击使用其他身份登录</p>
      <div className={getClass(flexBetween)}>
        <button type="button" className="btn btn-secondary btn-lg" onClick={router.back}>
          返回
        </button>
        <Button className="btn btn-primary btn-lg" request={reLogin} value="重新登录" />
      </div>
    </div>
  );
};

export default ReLogin;
