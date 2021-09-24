import { createContext, useCallback, useContext, useState, useEffect, useRef, useMemo } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { getScrollBarSize } from "utils/action";
import { useUpdate } from "./useBase";
import { applyRootStyles, cleanupRootStyles } from "utils/dom";
import { OverlayProps } from "types/components";
import { UseOverlayOpenType, UseOverlayPropsType, UseBodyLockType, UseOverlayBodyType } from "types/hook";

const OverlayOpenContext = createContext<UseOverlayOpenType>(() => {});

const useOverlayProps: UseOverlayPropsType = () => {
  const [overlay, setOverlay] = useState<OverlayProps | null>(null);
  const forceUpdate = useUpdate();
  const clear = useCallback(() => setOverlay(null), []);
  const open = useCallback(
    (props: OverlayProps) => {
      props.showState = true;
      props.closeHandler = () => {
        props.showState = false;
        forceUpdate();
      };
      props.clear = clear;
      setOverlay(props);
    },
    [forceUpdate]
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

const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
};

const useModalEffect = (isOpen: boolean, rootId?: string) => {
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

const useOverlayBody: UseOverlayBodyType = ({ body, closeHandler }) => {
  const bodyContent = useMemo(() => {
    if (typeof body === "function") {
      return body(closeHandler!);
    } else {
      return body;
    }
  }, [body, closeHandler]);

  return bodyContent;
};

export { OverlayOpenContext, useOverlayProps, useOverlayOpen, useBodyLock, useModalEffect, useOverlayBody };
