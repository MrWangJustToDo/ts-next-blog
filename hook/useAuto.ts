import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { log } from "utils/log";
import { loadImg } from "utils/image";
import { createRequest } from "utils/fetcher";
import { actionHandler } from "utils/action";
import { useBool } from "./useData";
import { useFailToast } from "./useToast";
import { useShowAndHideAnimate } from "./useAnimate";
import { ApiRequestResult } from "types/utils";
import {
  UseAutoActionHandlerProps,
  UseAutoActionHandlerType,
  UseAutoSetHeaderHeightType,
  UseAutoLoadCheckCodeImgProps,
  UseAutoLoadCheckCodeImgType,
  UseAutoShowAndHideType,
  UseAutoSetHeightProps,
  UseAutoSetHeightType,
  UseAutoLoadRandomImgType,
} from "types/hook";

const useAutoActionHandler: UseAutoActionHandlerType = <T, K>(
  {
    action,
    actionCallback,
    timmer,
    actionState = true,
    once = true,
    delayTime,
    rightNow = false,
    getRightNowState,
    currentRef,
    addListener,
    removeListener,
    addListenerCallback,
    removeListenerCallback,
  }: UseAutoActionHandlerProps<T, K>,
  ...deps: any[]
) => {
  const actionStateRef = useRef<boolean>();
  actionStateRef.current = actionState;
  useEffect(() => {
    const currentRightNow = rightNow ? rightNow : typeof getRightNowState === "function" ? getRightNowState() : false;
    const currentAction = action || actionCallback;
    if (!currentAction) {
      throw new Error("autoAction need a action to handle");
    }
    // 定时器
    if (timmer) {
      const actionCallback = () => {
        if (actionStateRef.current) currentAction();
      };
      if (delayTime === undefined) {
        log("timmer delayTime not set ---> useAutoActionHandler", "warn");
        delayTime = 0;
      }
      if (currentRightNow) actionCallback();
      if (once) {
        const id = setTimeout(actionCallback, delayTime);
        return () => clearTimeout(id);
      } else {
        const id = setInterval(actionCallback, delayTime);
        return () => clearInterval(id);
      }
    } else if (addListener) {
      // 事件监听
      if (!removeListener) {
        throw new Error("every addListener need a removeListener! ---> useAutoActionHandler");
      } else {
        if (actionStateRef.current) {
          if (currentRightNow) currentAction();
          if (currentRef?.current) {
            const ele = currentRef.current;
            addListener(currentAction, ele);
            return () => removeListener(currentAction, ele);
          } else {
            addListener(currentAction);
            return () => removeListener(currentAction);
          }
        }
      }
    } else if (addListenerCallback) {
      log("no useCallback autoAction", "normal");
      if (!removeListenerCallback) {
        throw new Error("every addListenerCallback need a removeListenerCallback! ---> useAutoActionHandler");
      } else {
        if (actionStateRef.current) {
          if (currentRightNow) currentAction();
          if (currentRef?.current) {
            const ele = currentRef.current;
            addListenerCallback(currentAction, ele);
            return () => removeListenerCallback(currentAction, ele);
          } else {
            addListenerCallback(currentAction);
            return () => removeListenerCallback(currentAction);
          }
        }
      }
    } else if (currentRightNow) {
      if (actionStateRef.current) {
        currentAction();
      }
    }
  }, [action, timmer, once, delayTime, rightNow, addListener, removeListener, currentRef, ...deps]);
};

const useAutoSetHeaderHeight: UseAutoSetHeaderHeightType = <T extends HTMLElement>(breakPoint: number = 1000) => {
  const ref = useRef<T>(null);
  const [bool, setBool] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(0);
  const setHeightCallback = useCallback<() => void>(
    debounce(
      () =>
        actionHandler<T, void, void>(ref.current, (ele) => {
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
    [breakPoint]
  );
  useAutoActionHandler({
    rightNow: true,
    actionState: bool,
    action: setHeightCallback,
    addListenerCallback: (action) => window.addEventListener("resize", action),
    removeListenerCallback: (action) => window.removeEventListener("resize", action),
  });
  return { ref, height };
};

const useAutoLoadCheckCodeImg: UseAutoLoadCheckCodeImgType = <T extends HTMLImageElement>({ imgUrl, strUrl, state = true }: UseAutoLoadCheckCodeImgProps) => {
  const ref = useRef<T>(null);
  const loadActionCallback = useCallback<() => void>(
    debounce(
      () => actionHandler<T, void, void>(ref.current, (ele) => loadImg({ imgUrl, strUrl, imgElement: ele, state })),
      400,
      { leading: true } // 立即执行一次
    ),
    [state]
  );
  useAutoActionHandler(
    {
      rightNow: true,
      action: loadActionCallback,
      addListenerCallback: (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.addEventListener("click", action)),
      removeListenerCallback: (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
    },
    state
  );
  return ref;
};

const useAutoShowAndHide: UseAutoShowAndHideType = <T extends HTMLElement>(breakPoint: number) => {
  const [value, setValue] = useState<boolean>(false);
  const autoSetValueHandler = useCallback<() => void>(
    throttle(() => {
      if (document.documentElement.scrollTop < breakPoint) {
        setValue(false);
      } else {
        setValue(true);
      }
    }, 400),
    [breakPoint]
  );
  useAutoActionHandler({
    rightNow: true,
    action: autoSetValueHandler,
    addListenerCallback: (action) => window.addEventListener("scroll", action),
    removeListenerCallback: (action) => window.removeEventListener("scroll", action),
  });
  const { animateRef: ref } = useShowAndHideAnimate<T>({ state: value, showClassName: "slideInRight", hideClassName: "slideOutRight" });
  return ref;
};

const useAutoSetHeight: UseAutoSetHeightType = <T extends HTMLElement>(props: UseAutoSetHeightProps<T> = {}) => {
  const { forWardRef, maxHeight = 9999, deps = [] } = props;
  const ref = useRef<T>(null);
  const currentRef = forWardRef ? forWardRef : ref;
  const [height, setHeight] = useState<number>(0);
  const setHeightCallback = useCallback<() => void>(
    debounce(
      () =>
        actionHandler<T, void, void>(currentRef.current, (ele) => {
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
    [maxHeight]
  );
  useAutoActionHandler(
    {
      rightNow: true,
      action: setHeightCallback,
      addListenerCallback: (action) => window.addEventListener("resize", action),
      removeListenerCallback: (action) => window.removeEventListener("resize", action),
    },
    ...deps
  );
  return [currentRef, height];
};

const useAutoLoadRandomImg: UseAutoLoadRandomImgType = ({ imgUrl, initUrl, getInitUrl }) => {
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
          .then((url) => (actionHandler<HTMLImageElement, string, void>(ref.current, (ele) => (ele.src = "")), url))
          .then((url) => actionHandler<HTMLImageElement, string, void>(ref.current, (ele) => (ele.src = url!)))
          .catch((e) => fail(`获取失败: ${e.toString()}`));
      },
      800,
      { leading: true }
    ),
    [request]
  );

  useEffect(() => {
    if (initUrl) {
      actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => (ele.src = initUrl));
    }
  }, [initUrl]);

  useEffect(() => {
    if (getInitUrl) {
      const res = getInitUrl();
      if (res) {
        actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => (ele.src = res));
      }
    }
  }, [getInitUrl]);

  useEffect(() => {
    const { current: img } = ref;
    if (img && img.complete) {
      show();
    }
  }, []);

  useEffect(() => {
    actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.addEventListener("load", show));
    () => actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.removeEventListener("load", show));
  }, []);

  useAutoActionHandler({
    action: loadSrc,
    getRightNowState,
    addListenerCallback: (action) => actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    removeListenerCallback: (action) => actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
  });

  return [ref, bool];
};

export { useAutoActionHandler, useAutoSetHeaderHeight, useAutoLoadCheckCodeImg, useAutoShowAndHide, useAutoSetHeight, useAutoLoadRandomImg };
