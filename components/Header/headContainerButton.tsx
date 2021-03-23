import { getClass } from "utils/class";
import { HeadContainerTagNavBtnType } from "types/components";

import style from "./index.module.scss";

let HeadContainerTagNavBtn: HeadContainerTagNavBtnType;

HeadContainerTagNavBtn = ({ handler }) => {
  return (
    <button type="button" className={getClass(style.btn, "navbar-toggler")} onClick={handler}>
      <span className="navbar-toggler-icon" />
    </button>
  );
};

export default HeadContainerTagNavBtn;
