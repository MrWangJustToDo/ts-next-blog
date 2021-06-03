import { createContext, useCallback, useContext, useState } from "react";
import { delay } from "utils/delay";
import { toastState } from "config/toast";
import { ToastProps } from "types/components";
import { UseToastPropsType, UseToastPushType, UseContentToastType } from "types/hook";

const ToastPushContext = createContext<UseToastPushType>(() => {});

const useToastProps: UseToastPropsType = (init = []) => {
  const [toast, setToast] = useState<ToastProps[]>(init);
  const filter = useCallback(() => setToast((lastState) => lastState.filter(({ showState }) => showState === true)), []);
  const update = useCallback(() => setToast((lastState) => [...lastState]), []);
  const push = useCallback<UseToastPushType>(
    (props) => {
      props.showState = true;
      props.currentTime = props.currentTime || new Date();
      props.closeHandler = () => {
        props.showState = false;
        update();
        delay(15000, filter, "toastFilter");
      };
      setToast((lastState) => [props, ...lastState]);
    },
    [filter, update]
  );
  return { toast, push };
};

const useCustomizeToast = (): UseToastPushType => {
  const push = useContext(ToastPushContext);
  const customizeToast = useCallback<UseToastPushType>((props) => push(props), []);
  return customizeToast;
};

const useFailToast: UseContentToastType = () => {
  const push = useContext(ToastPushContext);
  const failToast = useCallback<(content: string) => Promise<void>>(
    (content) => Promise.resolve(push({ title: "message", content, contentState: toastState.fail, autoCloseSecond: 3000 })),
    []
  );
  return failToast;
};

const useSucessToast: UseContentToastType = () => {
  const push = useContext(ToastPushContext);
  const failToast = useCallback<(content: string) => Promise<void>>(
    (content) => Promise.resolve(push({ title: "message", content, contentState: toastState.success, autoCloseSecond: 3000 })),
    []
  );
  return failToast;
};

export { ToastPushContext, useToastProps, useCustomizeToast, useFailToast, useSucessToast };
