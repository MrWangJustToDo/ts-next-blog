import { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { delay, cancel } from "utils/delay";
import { getScrollBarSize } from "utils/action";
import { OverlayProps } from "types/components";
import { UseOverlayOpenType, UseOverlayPropsType, UseBodyLockType } from "types/hook";

const OverlayOpenContext = createContext<UseOverlayOpenType>(() => {});

const useOverlayProps: UseOverlayPropsType = () => {
  const [overlay, setOverlay] = useState<OverlayProps | null>(null);
  const update = useCallback(() => setOverlay((last) => ({ ...last! })), []);
  const clear = useCallback(() => setOverlay(null), []);
  const open = useCallback(
    (props) => {
      cancel("replayModule");
      props.showState = true;
      props.closeHandler = () => {
        props.showState = false;
        update();
        delay(600, clear, "replayModule");
      };
      setOverlay(props);
    },
    [update]
  );
  return { overlay, open };
};

const useOverlayOpen = (): UseOverlayOpenType => {
  return useContext(OverlayOpenContext);
};

const useBodyLock: UseBodyLockType = ({ ref }) => {
  const [padding, setPadding] = useState<number>(0);

  useEffect(() => {
    if (padding === 0) {
      setPadding(getScrollBarSize());
    }
  }, [padding]);

  useEffect(() => {
    if (ref.current) {
      const ele = ref.current;
      disableBodyScroll(ele);
      document.body.style.paddingRight = `${padding}px`;
      return () => {
        enableBodyScroll(ele);
        document.body.style.paddingRight = `0px`;
      };
    }
  }, [padding]);
};

const highlightId = "react-modal-sheet-highlight";

export function applyRootStyles(rootId: string) {
  const body = document.querySelector("body") as HTMLBodyElement;
  const root = document.querySelector(`#${rootId}`) as HTMLDivElement;

  if (root) {
    const p = 24;
    const h = window.innerHeight;
    const s = (h - p) / h;
    body.style.backgroundColor = "#000";
    root.style.overflow = "hidden";
    root.style.willChange = "transform";
    root.style.transition = "transform 200ms linear";
    root.style.transform = `translateY(calc(env(safe-area-inset-top) + ${p / 2}px)) scale(${s})`; // prettier-ignore
    root.style.borderTopRightRadius = "10px";
    root.style.borderTopLeftRadius = "10px";

    // Add highlighed overlay to emphasize the modality effect
    const highlight = document.createElement("div");
    highlight.setAttribute("aria-hidden", "true");
    highlight.id = highlightId;
    highlight.style.position = "absolute";
    highlight.style.top = "0px";
    highlight.style.left = "0px";
    highlight.style.bottom = "0px";
    highlight.style.right = "0px";
    highlight.style.opacity = "0";
    highlight.style.transition = "opacity 200ms linear";
    highlight.style.backgroundColor = "rgba(150, 150, 150, 0.1)";

    root.appendChild(highlight);
    requestAnimationFrame(() => (highlight.style.opacity = "1"));
  }
}

export function cleanupRootStyles(rootId: string) {
  const body = document.querySelector("body") as HTMLBodyElement;
  const root = document.getElementById(rootId) as HTMLDivElement;
  const highlight = document.getElementById(highlightId) as HTMLDivElement;

  function onTransitionEnd() {
    root.style.removeProperty("overflow");
    root.style.removeProperty("will-change");
    root.style.removeProperty("transition");
    body.style.removeProperty("background-color");
    root.removeEventListener("transitionend", onTransitionEnd);
    highlight.parentNode?.removeChild(highlight);
  }

  if (root && highlight) {
    // Start animating back
    root.style.removeProperty("border-top-right-radius");
    root.style.removeProperty("border-top-left-radius");
    root.style.removeProperty("transform");
    highlight.style.opacity = "0";

    // Remove temp properties after animation is finished
    root.addEventListener("transitionend", onTransitionEnd);
  }
}

const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
};

export const useModalEffect = (isOpen: boolean, rootId?: string) => {
  const prevOpen = usePrevious(isOpen);

  // Automatically apply the iOS modal effect to the body when sheet opens/closes
  useEffect(() => {
    if (rootId && !prevOpen && isOpen) {
      applyRootStyles(rootId);
    } else if (rootId && !isOpen && prevOpen) {
      cleanupRootStyles(rootId);
    }
  }, [isOpen, prevOpen]);

  // Make sure to cleanup modal styles on unmount
  useEffect(() => {
    return () => {
      if (rootId && isOpen) cleanupRootStyles(rootId);
    };
  }, [isOpen]);
};

export { OverlayOpenContext, useOverlayProps, useOverlayOpen, useBodyLock };
