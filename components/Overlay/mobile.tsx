import { useRef, useCallback, useEffect } from "react";
import { motion, PanInfo, useMotionValue, AnimatePresence, animate, useTransform } from "framer-motion";
import { useBodyLock, useModalEffect, useOverlayBody } from "hook/useOverlay";
import { getClass } from "utils/dom";
import { OverlayType } from "types/components";

import style from "./index.module.scss";

const Overlay: OverlayType = ({ head, body, foot, closeHandler, showState, className = "", clear, height = 90 }) => {
  const ref = useRef<HTMLDivElement>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const stateRef = useRef<boolean>(Boolean(showState));

  useEffect(() => {
    stateRef.current = Boolean(showState);
  });

  const indicatorRotation = useMotionValue(0);

  const indicator1Transform = useTransform(indicatorRotation, (r) => `translateX(2px) rotate(${r}deg)`);

  const indicator2Transform = useTransform(indicatorRotation, (r) => `translateX(-2px) rotate(${-1 * r}deg)`);

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
      if (velocity.y > 500) {
        closeHandler && closeHandler();
      } else {
        const modal = modalRef.current as HTMLDivElement;
        const contentHeight = modal.getBoundingClientRect().height;
        if (y.get() / contentHeight > 0.6) {
          closeHandler && closeHandler();
        } else {
          animate(y, 0, { type: "spring", ...{ stiffness: 300, damping: 30, mass: 0.2 } });
        }
        indicatorRotation.set(0);
      }
    },
    [indicatorRotation]
  );

  const animationComplete = useCallback(() => {
    if (!stateRef.current && clear) {
      clear();
    }
  }, [clear]);

  useModalEffect(Boolean(showState), "page-content");

  useBodyLock({ ref });

  const bodyContent = useOverlayBody({ body, closeHandler });

  return (
    <div className={style.modalContainer}>
      <AnimatePresence>
        {showState ? (
          <motion.div
            key="1"
            drag="y"
            style={{ height: "100%", width: "100%" }}
            dragConstraints={{ bottom: 0, top: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          >
            <motion.div className={getClass("position-absolute")} style={{ height: `${height}%`, bottom: 0, width: "100%" }}>
              <motion.div
                layout
                ref={modalRef}
                style={{ height: "100%", y }}
                initial={{ y: window.innerHeight }}
                animate={{ y: 0, transition: { type: "tween" } }}
                exit={{ y: window.innerHeight }}
                className={getClass("user-select-none position-absolute", style.mobileModal, className)}
                onAnimationComplete={animationComplete}
              >
                <div className={getClass("w-100", style.mobileHead)}>
                  <motion.span className={getClass(style.indicator)} style={{ transform: indicator1Transform }} />
                  <motion.span className={getClass(style.indicator)} style={{ transform: indicator2Transform }} />
                </div>
                <div ref={ref} className={getClass(style.mobileContent, "p-4")}>
                  <div className="mb-3">{head}</div>
                  {bodyContent}
                  {foot}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Overlay;
