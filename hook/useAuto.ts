import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { log } from "utils/log";
import { loadImg } from "utils/image";
import { createRequest } from "utils/fetcher";
import { actionHandler } from "utils/action";
import { useBool } from "./useData";
import { useFailToast } from "./useToast";
import { useUpdateProps } from "./useBase";
import { useShowAndHideAnimate } from "./useAnimate";
import { ApiRequestResult } from "types/utils";
import { apiName } from "config/api";

interface UseAutoActionHandlerProps<T, K> {
  action?: (e?: T) => void;
  actionCallback?: (e?: T) => void; // action 不需要useCallback
  actionState?: boolean; // 当前需要执行的状态，在事件监听回调中用于判断是否还需要绑定监听，在定时器中用于判断本次action是否需要执行
  timer?: boolean; // 是否使用定时器
  once?: boolean; // 执行一次，for timer
  delayTime?: number; // 定时器执行时间间隔
  rightNow?: boolean; // 立即执行，for listener
  getRightNowState?: () => boolean;
  componentName?: string;
  forwardRef?: RefObject<K>;
  addListener?: (action: (e?: T) => void, ele?: K) => void; // 添加事件监听
  removeListener?: (action: (e?: T) => void, ele?: K) => void; // 移除事件监听
  addListenerCallback?: (action: (e?: T) => void, ele?: K) => void; // 添加事件监听  不需要useCallback
  removeListenerCallback?: (action: (e?: T) => void, ele?: K) => void; // 移除事件监听  不需要useCallback
  deps?: any[];
}
interface UseAutoActionHandlerType {
  <T extends Event, K>(props: UseAutoActionHandlerProps<T, K>, ...deps: any[]): void;
}
interface UseAutoSetHeaderHeightType {
  <T extends HTMLElement>(breakPoint?: number): { ref: RefObject<T>; height: number };
}
interface UseAutoLoadCheckCodeImgProps {
  imgUrl: apiName;
  strUrl: apiName;
  state?: boolean;
}
interface UseAutoLoadCheckCodeImgType {
  <T extends HTMLImageElement>(props: UseAutoLoadCheckCodeImgProps): RefObject<T>;
}
interface UseAutoShowAndHideType {
  <T extends HTMLElement>(breakPoint: number): RefObject<T>;
}
interface UseAutoSetHeightProps<T> {
  forWardRef?: RefObject<T>;
  maxHeight?: number;
  deps?: any[];
}
interface UseAutoSetHeightType {
  <T extends HTMLElement>(props?: UseAutoSetHeightProps<T>): [RefObject<T>, number];
}
interface UseAutoLoadRandomImgProps {
  imgUrl: apiName;
  initUrl?: string;
  getInitUrl?: () => string | undefined;
}
interface UseAutoLoadRandomImgType {
  (props: UseAutoLoadRandomImgProps): [RefObject<HTMLImageElement>, boolean];
}

export const useAutoActionHandler: UseAutoActionHandlerType = <T, K>({
  action,
  actionCallback,
  timer,
  actionState = true,
  once = true,
  delayTime,
  rightNow = false,
  getRightNowState,
  componentName,
  forwardRef,
  addListener,
  removeListener,
  addListenerCallback,
  removeListenerCallback,
  deps = [],
}: UseAutoActionHandlerProps<T, K>) => {
  const actionStateRef = useRef<boolean>();
  actionStateRef.current = actionState;
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useUpdateProps(componentName || "useAutoActionHandler", { action, timer, once, delayTime, rightNow, addListener, removeListener, forwardRef, ...deps });
  }
  useEffect(() => {
    const currentRightNow = rightNow ? rightNow : typeof getRightNowState === "function" ? getRightNowState() : false;
    const currentAction = action || actionCallback;
    if (!currentAction) {
      throw new Error("autoAction need a action to handle");
    }
    const actionCallbackWithState = (...props: any[]) => {
      if (actionStateRef.current) currentAction.call(null, ...props);
    };
    // 定时器
    if (timer) {
      if (delayTime === undefined) {
        log("timer delayTime not set ---> useAutoActionHandler", "warn");
        delayTime = 0;
      }
      if (currentRightNow) actionCallbackWithState();
      if (once) {
        const id = setTimeout(actionCallbackWithState, delayTime);
        return () => clearTimeout(id);
      } else {
        const id = setInterval(actionCallbackWithState, delayTime);
        return () => clearInterval(id);
      }
    } else if (addListener) {
      // 事件监听
      if (!removeListener) {
        throw new Error("every addListener need a removeListener! ---> useAutoActionHandler");
      } else {
        if (currentRightNow) actionCallbackWithState();
        const ele = forwardRef?.current || undefined;
        addListener(actionCallbackWithState, ele);
        return () => removeListener(actionCallbackWithState, ele);
      }
    } else if (addListenerCallback) {
      if (!removeListenerCallback) {
        throw new Error("every addListenerCallback need a removeListenerCallback! ---> useAutoActionHandler");
      } else {
        if (currentRightNow) actionCallbackWithState();
        const ele = forwardRef?.current || undefined;
        addListenerCallback(actionCallbackWithState, ele);
        return () => removeListenerCallback(actionCallbackWithState, ele);
      }
    } else if (currentRightNow) {
      actionCallbackWithState()
    }
  }, [action, timer, once, delayTime, rightNow, addListener, removeListener, forwardRef, ...deps]);
};

export const useAutoSetHeaderHeight: UseAutoSetHeaderHeightType = <T extends HTMLElement>(breakPoint: number = 1000) => {
  const ref = useRef<T>(null);
  const [bool, setBool] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(0);
  useAutoActionHandler({
    rightNow: true,
    actionState: bool,
    actionCallback: debounce(
      () =>
        actionHandler<T, void>(ref.current, (ele) => {
          if (document.body.offsetWidth < breakPoint) {
            setBool(false);
            ele.style.height = "auto";
            const allHeight = ele.offsetHeight;
            ele.setAttribute("data-height", `${allHeight}px`);
            setHeight(allHeight);
            ele.style.height = "0px";
          }
        }),
      300,
      { leading: true }
    ),
    addListenerCallback: (action) => window.addEventListener("resize", action),
    removeListenerCallback: (action) => window.removeEventListener("resize", action),
    deps: [breakPoint],
  });
  return { ref, height };
};

export const useAutoLoadCheckCodeImg: UseAutoLoadCheckCodeImgType = <T extends HTMLImageElement>({
  imgUrl,
  strUrl,
  state = true,
}: UseAutoLoadCheckCodeImgProps) => {
  const ref = useRef<T>(null);
  useAutoActionHandler({
    rightNow: true,
    actionCallback: debounce(
      () => actionHandler<T, void>(ref.current, (ele) => loadImg({ imgUrl, strUrl, imgElement: ele, state })),
      400,
      { leading: true } // 立即执行一次
    ),
    addListenerCallback: (action) => actionHandler<T, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    removeListenerCallback: (action) => actionHandler<T, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
    deps: [state],
  });
  return ref;
};

export const useAutoShowAndHide: UseAutoShowAndHideType = <T extends HTMLElement>(breakPoint: number) => {
  const [value, setValue] = useState<boolean>(false);
  useAutoActionHandler(
    {
      rightNow: true,
      actionCallback: throttle(() => {
        if (document.documentElement.scrollTop < breakPoint) {
          setValue(false);
        } else {
          setValue(true);
        }
      }, 400),
      addListenerCallback: (action) => window.addEventListener("scroll", action),
      removeListenerCallback: (action) => window.removeEventListener("scroll", action),
    },
    breakPoint
  );
  const { animateRef: ref } = useShowAndHideAnimate<T>({ state: value, showClassName: "slideInRight", hideClassName: "slideOutRight" });
  return ref;
};

export const useAutoSetHeight: UseAutoSetHeightType = <T extends HTMLElement>(props: UseAutoSetHeightProps<T> = {}) => {
  const { forWardRef, maxHeight = 9999, deps = [] } = props;
  const ref = useRef<T>(null);
  const currentRef = forWardRef ? forWardRef : ref;
  const [height, setHeight] = useState<number>(0);
  useAutoActionHandler(
    {
      rightNow: true,
      actionCallback: debounce(
        () =>
          actionHandler<T, void>(currentRef.current, (ele) => {
            const lastHeight = ele.offsetHeight;
            ele.style.height = "auto";
            const allHeight = ele.offsetHeight;
            const targetHeight = maxHeight > allHeight ? allHeight : maxHeight;
            ele.setAttribute("data-height", `${allHeight}px`);
            ele.style.height = `${lastHeight}px`;
            setHeight(targetHeight);
          }),
        400,
        { leading: true }
      ),
      addListenerCallback: (action) => window.addEventListener("resize", action),
      removeListenerCallback: (action) => window.removeEventListener("resize", action),
    },
    maxHeight,
    ...deps
  );
  return [currentRef, height];
};

export const useAutoLoadRandomImg: UseAutoLoadRandomImgType = ({ imgUrl, initUrl, getInitUrl }) => {
  const fail = useFailToast();
  const { bool, show, hide } = useBool();
  const ref = useRef<HTMLImageElement>(null);
  const request = useMemo(() => createRequest({ apiPath: imgUrl, header: { apiToken: true }, cache: false }), [imgUrl]);
  // must a function for useEffect
  const getRightNowState = useCallback(() => {
    if (initUrl) {
      return false;
    } else if (getInitUrl) {
      return !getInitUrl();
    }
    return true;
  }, [initUrl, getInitUrl]);
  const loadSrc = useCallback<() => void>(
    debounce(
      () => {
        hide();
        const getImgUrl = () =>
          request.run<ApiRequestResult<string>>().then(({ data }) => {
            if (Array.isArray(data)) {
              throw new Error(`接口返回数据不正确：${data.toString()}`);
            } else {
              return data;
            }
          });
        const url = ref.current?.src;
        const getUniqueImg = (): Promise<string> => getImgUrl().then((newUrl) => (newUrl === url ? getUniqueImg() : newUrl));
        // 保证前后两次加载的图片路径不一致
        getUniqueImg()
          .then((url) => (actionHandler<HTMLImageElement, string>(ref.current, (ele) => (ele.src = "")), url))
          .then((url) => actionHandler<HTMLImageElement, void>(ref.current, (ele) => (ele.src = url!)))
          .catch((e) => fail(`获取失败: ${e.toString()}`));
      },
      800,
      { leading: true }
    ),
    [request]
  );

  useEffect(() => {
    if (initUrl) {
      actionHandler<HTMLImageElement, void>(ref.current, (ele) => (ele.src = initUrl));
    }
  }, [initUrl]);

  useEffect(() => {
    if (getInitUrl) {
      const res = getInitUrl();
      if (res) {
        actionHandler<HTMLImageElement, void>(ref.current, (ele) => (ele.src = res));
      }
    }
  }, [getInitUrl]);

  useEffect(() => {
    const { current: img } = ref;
    if (img && img.complete) {
      show();
    }
  }, [show]);

  useEffect(() => {
    actionHandler<HTMLImageElement, void>(ref.current, (ele) => ele.addEventListener("load", show));
    () => actionHandler<HTMLImageElement, void>(ref.current, (ele) => ele.removeEventListener("load", show));
  }, [show]);

  useAutoActionHandler({
    action: loadSrc,
    getRightNowState,
    addListenerCallback: (action) => actionHandler<HTMLImageElement, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    removeListenerCallback: (action) => actionHandler<HTMLImageElement, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
  });

  return [ref, bool];
};
