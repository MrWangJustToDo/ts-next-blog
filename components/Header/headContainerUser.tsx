import Link from "next/link";
import { useCallback } from "react";
import { useBool } from "hook/useData";
import { useRouter } from "next/dist/client/router";
import { Image } from "components/Image";
import { useCurrentUser, useLogout } from "hook/useUser";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { getCurrentAvatar } from "utils/data";
import { animateFadeIn, flexCenter, getClass } from "utils/dom";

import style from "./index.module.scss";

export const HeadContainerUser = () => {
  const router = useRouter();

  const logout = useLogout();

  const { username, avatar, gender, userId } = useCurrentUser();

  const { bool, switchBoolDebounce, hideDebounce } = useBool();

  const logoutCallback = useCallback(() => {
    logout().then(hideDebounce);
  }, [logout, hideDebounce]);

  const { animateRef: ref } = useShowAndHideAnimate<HTMLDivElement>({
    state: bool,
    showClassName: "flipInX",
    hideClassName: "flipOutX",
    deps: [userId],
  });

  return userId ? (
    <div className={getClass("d-inline-block", style.headUser, bool ? style.headUserActive : "")}>
      <div className={getClass("bg-dark", animateFadeIn, flexCenter, style.userPanel)} onClick={switchBoolDebounce}>
        <Image className="rounded-circle" src={getCurrentAvatar(avatar, gender)} alt="头像" height="30" width="30" />
        <span className={getClass("mx-2 text-info", style.username)}>{username}</span>
      </div>
      <div ref={ref} className={getClass("w-100 position-absolute", style.dropPanel)}>
        <div className={getClass("position-absolute", style.hoverTriangle)} />
        <div className={getClass("position-absolute d-flex", style.controlPanel)}>
          <Link href="/publish">
            <a className="small text-info text-decoration-none text-nowrap" onClick={hideDebounce}>
              写博客
            </a>
          </Link>
          <Link href="/manage">
            <a className="small text-info text-decoration-none text-nowrap" onClick={hideDebounce}>
              管理
            </a>
          </Link>
          <a className="small text-info text-decoration-none text-nowrap cursor-pointer" onClick={logoutCallback}>
            退出
          </a>
        </div>
      </div>
    </div>
  ) : router.pathname !== "/login" ? (
    <Link href="/login">
      <a className={getClass("text-info", style.login, flexCenter)}>
        <i className="ri-arrow-right-line" />
        <span className="ml-1 ml-md-2">去登录</span>
      </a>
    </Link>
  ) : null;
};
