import { RefObject, useEffect, useRef } from "react";
import { useBool } from "./useData";
import { cancel, delay } from "utils/delay";
import { LoadingBarProps } from "types/components";

interface UseLoadReturn {
  start: () => void;
  end: () => void;
  ref: RefObject<HTMLDivElement>;
}
interface UseLoadType {
  (props: LoadingBarProps): UseLoadReturn;
}

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
        let count = 1;
        let id: number = 0;
        const start = () => {
          if (count > 0.00003) {
            count -= 0.000001;
          }
          let next = state.current.present! + count;
          next = next < 99.5 ? next : 99.5;
          ele.style.cssText =
            "z-index: 999;" +
            "top: 0;" +
            `height: ${state.current.height}px;` +
            `transform-origin: 0 0;` +
            `transform: scale(${next / 100}, 1);` +
            `filter: drop-shadow(2px 2px 2px rgba(200, 200, 200, 0.65))`;
          state.current.present = next;
          id = requestAnimationFrame(start);
        };
        id = requestAnimationFrame(start);
        return () => cancelAnimationFrame(id);
      } else {
        delay(40, () => (ele.style.transform = "scale(1)"), "loadingBar").then(() => delay(80, () => (ele.style.height = "0px"), "loadingBar"));
        return () => cancel("loadingBar");
      }
    }
  }, [bool, targetRef]);

  return { start: show, end: hide, ref: targetRef };
};

export default useLoad;
