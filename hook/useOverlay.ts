import { createContext, useCallback, useContext, useState, useEffect } from "react";
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

export { OverlayOpenContext, useOverlayProps, useOverlayOpen, useBodyLock };
