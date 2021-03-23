import Link from "next/link";
import { useBool } from "hook/useData";
import { useCurrentUser, useLogout } from "hook/useUser";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { getCurrentAvatar } from "utils/data";
import { flexCenter, getClass } from "utils/class";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

let HeadContainerUser: SimpleElement;

HeadContainerUser = () => {
  const logoutCallback = useLogout();
  const { username, avatar, gender, userId } = useCurrentUser();
  const { bool, switchBoolThrottle, hideDebounceState } = useBool();
  const ref = useShowAndHideAnimate<HTMLDivElement>({
    state: bool,
    key: "admin",
    showClassName: "animate__flipInX",
    hideClassName: "animate__flipOutX",
  });
  return userId ? (
    <div className={getClass("d-inline-block", style.headUser, bool ? style.headUserActive : "")}>
      <div className={getClass("bg-dark", flexCenter, style.userPanel)} onClick={switchBoolThrottle}>
        <img className="rounded-circle" src={getCurrentAvatar(avatar, gender)} alt="头像" height="30" width="30" />
        <span className={getClass("mx-2 text-info", style.username)}>{username}</span>
      </div>
      <div ref={ref} className={getClass("w-100 position-absolute", style.dropPanel)} style={{ display: "none" }}>
        <div className={getClass("position-absolute", style.hoverTriangle)} />
        <div className={getClass("position-absolute d-flex", style.controlPanel)}>
          <Link href="/publish">
            <a className="small text-info text-decoration-none text-nowrap" onClick={hideDebounceState}>
              写博客
            </a>
          </Link>
          <Link href="/manage">
            <a className="small text-info text-decoration-none text-nowrap" onClick={hideDebounceState}>
              管理
            </a>
          </Link>
          <div className="small text-info text-decoration-none text-nowrap cursor-pointer" onClick={logoutCallback}>
            退出
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Link href="/login">
      <a className={getClass("text-info", style.login, flexCenter)}>
        <i className="ri-arrow-right-line" />
        <span className="ml-1 ml-md-2">去登录</span>
      </a>
    </Link>
  );
};

export default HeadContainerUser;
