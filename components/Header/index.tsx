import { getClass } from "utils/class";
import { useBool } from "hook/useData";
import HeadContainerList from "./headContainerList";
import HeadContainerUser from "./headContainerUser";
import HeadContainerButton from "./headContainerButton";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

let Header: SimpleElement;

Header = () => {
  const { bool, switchBoolThrottle } = useBool();
  
  return (
    <nav className={getClass(style.navShadow, "navbar navbar-expand-lg navbar-dark bg-dark py-lg-4")}>
      <div className="container-xl user-select-none">
        <div className="navbar-brand text-info font-weight-bold">Blog</div>
        <HeadContainerButton handler={switchBoolThrottle} />
        <HeadContainerList show={bool} />
        <HeadContainerUser />
      </div>
    </nav>
  );
};

export default Header;
