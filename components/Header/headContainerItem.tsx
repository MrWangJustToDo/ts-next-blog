import Link from "next/link";
import { useCallback } from "react";
import { useHeaderItem } from "hook/useHeader";
import { getClass } from "utils/dom";
import { HeadContainerItemType } from "types/components";

import style from "./index.module.scss";

export const HeadContainerItem: HeadContainerItemType = ({ value = "head", hrefTo = "/", icon = "ri-home-heart-fill" }) => {
  const { currentHeader, changeCurrentHeader } = useHeaderItem();

  const clickHandler = useCallback(() => {
    changeCurrentHeader(hrefTo);
  }, [hrefTo]);

  return (
    <li className={getClass(style.nav_hover, "nav-item px-lg-3", currentHeader === hrefTo ? style.nav_active : "")}>
      <Link href={hrefTo}>
        <a className={getClass("nav-link text-reset d-flex")} onClick={clickHandler}>
          <i className={getClass(style.icon, icon)} />
          {value}
        </a>
      </Link>
    </li>
  );
};
