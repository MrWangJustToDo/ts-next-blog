import Link from "next/link";
import { useState } from "react";
import { LoginUsername } from "./loginUsername";
import { LoginPassword } from "./loginPassword";
import { LoginCheckCode } from "./loginCheckCode";
import { LoginSubmit } from "./loginSubmit";
import { useLogin } from "hook/useUser";
import { flexCenter, getClass } from "utils/dom";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

export const Login: SimpleElement = () => {
  const formRef = useLogin();

  const [username, setUsername] = useState<boolean>(false);

  const [password, setPassword] = useState<boolean>(false);

  return (
    <div className={getClass("rounded my-4 my-lg-5 px-3 overflow-auto user-select-none", style.loginForm)}>
      <Link href="/">
        <a className={getClass("position-absolute text-info", flexCenter, style.back)}>
          <i className="ri-arrow-left-line" />
          <span className="ml-1 ml-md-2">返回首页</span>
        </a>
      </Link>
      <h3 className="my-4 text-center">登录</h3>
      <form className="px-lg-5 px-3 py-2" ref={formRef}>
        <LoginUsername setState={setUsername} />
        <LoginPassword setState={setPassword} />
        <LoginCheckCode show={username && password} />
        <LoginSubmit enabled={username && password} />
      </form>
    </div>
  );
};
