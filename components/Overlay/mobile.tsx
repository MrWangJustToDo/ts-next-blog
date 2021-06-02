import { useMemo } from "react";
import { motion } from "framer-motion";
import { OverlayType } from "types/components";
import { flexBetween, getClass } from "utils/class";

import style from "./index.module.scss";

const Overlay: OverlayType = ({ head, body, foot, closeHandler, showState, className = "" }) => {
  const bodyContent = useMemo(() => {
    if (typeof body === "function" && closeHandler) {
      return body(closeHandler);
    } else {
      return body;
    }
  }, [body]);

  const variant = useMemo(
    () => ({
      show: {
        height: "80%",
        opacity: 1,
      },
      hide: {
        height: "0",
        opacity: 0,
      },
    }),
    []
  );

  return (
    <motion.div
      className={getClass("card m-auto user-select-none", style.mobileModal, className)}
      variants={variant}
      initial="hide"
      animate={showState ? "show" : "hide"}
      drag="y"
      dragConstraints={{ bottom: 0, top: 0 }}
    >
      <div className={getClass("card-header", flexBetween)}>
        {head}
        <button className="close" style={{ outline: "none" }} onClick={closeHandler}>
          <i className="ri-close-line small ml-4" />
        </button>
      </div>
      <div className="card-body">{bodyContent}</div>
      {foot && <div className="card-footer">{foot}</div>}
    </motion.div>
  );
};

export default Overlay;
