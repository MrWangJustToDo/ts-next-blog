import Link from "next/link";
import { useBool } from "hook/useData";
import { getClass } from "utils/dom";
import HeadContainerList from "./headContainerList";
import HeadContainerUser from "./headContainerUser";
import HeadContainerButton from "./headContainerButton";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

const Header: SimpleElement = () => {
  const { bool, switchBoolDebounce } = useBool();

  return (
    <header id="header" className={getClass(style.navShadow, "navbar navbar-expand-lg navbar-dark bg-dark py-lg-4")}>
      <div className="container-xl user-select-none">
        <Link href="/">
          <a className="navbar-brand text-info font-weight-bold">Blog</a>
        </Link>
        <HeadContainerButton handler={switchBoolDebounce} />
        <HeadContainerList show={bool} />
        <HeadContainerUser />
      </div>
    </header>
  );
};

export default Header;
