import { createContext, useCallback, useContext, useState } from "react";
import { delay } from "utils/delay";
import { useUpdate } from "./useBase";
import { toastState } from "config/toast";
import type { ToastProps } from "types/components";

interface UseToastPushType {
  (props: ToastProps): ToastProps;
}
interface UseToastPropsType {
  (init: ToastProps[]): { toast: ToastProps[]; push: UseToastPushType };
}
interface UseContentToastType {
  (): (content: string) => ToastProps;
}

export const ToastPushContext = createContext<UseToastPushType>(() => ({ title: "", content: "" }));

export const useToastProps: UseToastPropsType = (init = []) => {
  const [toast, setToast] = useState<ToastProps[]>(init);
  const filter = useCallback(() => setToast((lastState) => lastState.filter(({ showState }) => showState === true)), []);
  const forceUpdate = useUpdate();
  const push = useCallback<UseToastPushType>(
    (props) => {
      props.showState = true;
      props.currentTime = props.currentTime || new Date();
      props.closeHandler = () => {
        props.showState = false;
        forceUpdate();
        delay(15000, filter, "toastFilter");
      };
      setToast((lastState) => [props, ...lastState]);
      return props;
    },
    [filter, forceUpdate]
  );
  return { toast, push };
};

export const useCustomizeToast = (): UseToastPushType => {
  const push = useContext(ToastPushContext);
  const customizeToast = useCallback<UseToastPushType>((props) => push(props), [push]);
  return customizeToast;
};

export const useFailToast: UseContentToastType = () => {
  const push = useContext(ToastPushContext);
  const failToast = useCallback<(content: string) => ToastProps>(
    (content) => push({ title: "message", content, contentState: toastState.fail, autoCloseSecond: 3000 }),
    [push]
  );
  return failToast;
};

export const useSuccessToast: UseContentToastType = () => {
  const push = useContext(ToastPushContext);
  const failToast = useCallback<(content: string) => ToastProps>(
    (content) => push({ title: "message", content, contentState: toastState.success, autoCloseSecond: 3000 }),
    [push]
  );
  return failToast;
};
