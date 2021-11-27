import { createContext, useCallback, useContext, useState, useEffect, useRef, useMemo, RefObject } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { useUpdate } from "./useBase";
import { applyRootStyles, cleanupRootStyles } from "utils/dom";
import { OverlayProps } from "types/components";

interface UseOverlayOpenType {
  (props: OverlayProps): void;
}
interface UseOverlayPropsType {
  (): { overlay: OverlayProps | null; open: UseOverlayOpenType };
}
interface UseBodyLockType {
  (props: { ref: RefObject<HTMLElement> }): void;
}
interface UseOverlayBodyType {
  (props: { body: JSX.Element | ((handler: () => void) => JSX.Element); closeHandler?: () => void }): JSX.Element;
}

export const OverlayOpenContext = createContext<UseOverlayOpenType>(() => {});

export const useOverlayProps: UseOverlayPropsType = () => {
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
    [clear, forceUpdate]
  );
  return { overlay, open };
};

export const useOverlayOpen = (): UseOverlayOpenType => {
  return useContext(OverlayOpenContext);
};

export const useBodyLock: UseBodyLockType = ({ ref }) => {
  useEffect(() => {
    if (ref.current) {
      const ele = ref.current;
      disableBodyScroll(ele);
      return () => {
        enableBodyScroll(ele);
      };
    }
  }, [ref]);
};

export const usePrevious = <T>(state: T): T | undefined => {
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
  }, [isOpen, prevOpen, rootId]);

  // Make sure to cleanup modal styles on unmount
  useEffect(() => {
    return () => {
      if (rootId && isOpen) cleanupRootStyles(rootId);
    };
  }, [isOpen, rootId]);
};

export const useOverlayBody: UseOverlayBodyType = ({ body, closeHandler }) => {
  const bodyContent = useMemo(() => {
    if (typeof body === "function") {
      return body(closeHandler!);
    } else {
      return body;
    }
  }, [body, closeHandler]);

  return bodyContent;
};
