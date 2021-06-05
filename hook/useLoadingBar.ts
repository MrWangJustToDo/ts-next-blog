import { useEffect, useRef } from "react";
import { useBool } from "./useData";
import { cancel, delay } from "utils/delay";
import { UseLoadType } from "types/hook";
import { LoadingBarProps } from "types/components";

const useLoad: UseLoadType = ({ height = 1.5, present = 0, forwardRef }) => {
  const ref = useRef<HTMLDivElement>(null);
  const targetRef = forwardRef || ref;
  const state = useRef<LoadingBarProps>({ present });
  const { bool, show, hide } = useBool();
  useEffect(() => {
    state.current.height = height;
    state.current.present = present;
  }, [bool, height, present]);

  useEffect(() => {
    if (targetRef.current) {
      const ele = targetRef.current;
      if (bool) {
        let count = 8;
        const id = setInterval(() => {
          if (count > 1) {
            count--;
          }
          let next = state.current.present! + (Math.random() + count - Math.random());
          next = next < 99.5 ? next : 99.5;
          ele.style.cssText =
            "z-index: 999;" +
            "top: 0;" +
            `height: ${state.current.height}px;` +
            `transform-origin: 0 0;` +
            `transform: scale(${next / 100}, 1);` +
            `filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, 0.65))`;
          state.current.present = next;
        }, 60);
        return () => clearInterval(id);
      } else {
        delay(40, () => (ele.style.transform = "scale(1)"), "loadingBar").then(() => delay(80, () => (ele.style.height = "0px"), "loadingBar"));
        return () => cancel("loadingBar");
      }
    }
  }, [bool, targetRef]);

  return { start: show, end: hide, ref: targetRef };
};

export default useLoad;
