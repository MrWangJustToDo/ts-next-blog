// 回复按钮点击后的弹出框
import { createContext, useCallback, useContext, useState } from "react";
import { delay, cancel } from "utils/delay";
import { OverlayProps } from "types/components";
import { UseOverlayOpenType, UseOverlayPropsType } from "types/hook";

const OverlayOpenContext = createContext<UseOverlayOpenType>(() => {});

let useOverlayProps: UseOverlayPropsType;

let useOverlayOpen: () => UseOverlayOpenType;

useOverlayProps = () => {
  const [overlay, setReplay] = useState<OverlayProps | null>(null);
  const update = useCallback(() => setReplay((last) => ({ ...last! })), []);
  const clear = useCallback(() => setReplay(null), []);
  const open = useCallback(
    (props) => {
      cancel("replayModule");
      props.showState = true;
      props.closeHandler = () => {
        props.showState = false;
        update();
        delay(600, clear, "replayModule");
      };
      setReplay(props);
    },
    [update]
  );
  return { overlay, open };
};

useOverlayOpen = () => {
  return useContext(OverlayOpenContext);
};

export { OverlayOpenContext, useOverlayProps, useOverlayOpen };
