import { useMemo, useRef, useCallback } from "react";
import { motion, PanInfo, useMotionValue, AnimatePresence, animate } from "framer-motion";
import { OverlayType } from "types/components";
import { flexBetween, getClass } from "utils/class";
import { useBodyLock, useModalEffect } from "hook/useOverlay";

import style from "./index.module.scss";

const Overlay: OverlayType = ({ head, body, foot, closeHandler, showState, className = "" }) => {
  // 大致理解实现了  内容不可drag  用于获取drag的数据  通过context应用到外围的parent上
  // 照着这个思路实现一下

  // 初步实现了一下  还需要继续研究

  const ref = useRef<HTMLDivElement>(null);

  const indicatorRotation = useMotionValue(0);

  const y = useMotionValue(typeof window !== "undefined" ? window.innerHeight : 0);

  const handleDrag = useCallback((_, { delta }: PanInfo) => {
    // Update drag indicator rotation based on drag velocity
    const velocity = y.getVelocity();
    if (velocity > 0) indicatorRotation.set(10);
    if (velocity < 0) indicatorRotation.set(-10);
    // Make sure user cannot drag beyond the top of the sheet
    y.set(Math.max(y.get() + delta.y, 0));
  }, []);

  const handleDragEnd = useCallback(
    (_, { velocity }: PanInfo) => {
      // if (velocity.y > 500) {
      // User flicked the sheet down
      // } else {
      // Update the spring value so that the sheet is animated to the snap point
      animate(y, 0, { type: "spring", ...{ stiffness: 300, damping: 30, mass: 0.2 } });

      // Reset indicator rotation after dragging
      indicatorRotation.set(0);
      // }
    },
    [indicatorRotation]
  );

  useModalEffect(true, "content");

  const bodyContent = useMemo(() => {
    if (typeof body === "function" && closeHandler) {
      return body(closeHandler);
    } else {
      return body;
    }
  }, [body]);

  useBodyLock({ ref });

  return (
    <div ref={ref} className={style.modalContainer}>
      <AnimatePresence>
        <motion.div
          style={{ height: "100%" }}
          key="1"
          drag="y"
          dragConstraints={{ bottom: 0, top: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        >
          <motion.div className={getClass("position-absolute")} style={{ height: "80%", bottom: 0, width: "100%" }}>
            <motion.div
              style={{ height: "100%", y }}
              initial={{ y: window.innerHeight }}
              animate={{ y: 0, transition: { type: "tween" } }}
              exit={{ y: window.innerHeight }}
              className={getClass("card m-auto user-select-none", style.mobileModal, className)}
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
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Overlay;
