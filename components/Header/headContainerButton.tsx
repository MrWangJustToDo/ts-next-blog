import { getClass } from "utils/dom";
import { HeadContainerTagNavBtnType } from "types/components";

import style from "./index.module.scss";

const HeadContainerTagNavBtn: HeadContainerTagNavBtnType = ({ handler }) => {
  return (
    <button type="button" className={getClass(style.btn, "navbar-toggler")} onClick={handler}>
      <span className="navbar-toggler-icon" />
    </button>
  );
};

export default HeadContainerTagNavBtn;
