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
  UseAutoLoadCheckcodeImgProps,
  UseAutoLoadCheckcodeImgType,
  UseAutoShowAndHideType,
  UseAutoSetHeightProps,
  UseAutoSetHeightType,
  UseAutoLoadRandomImgType,
} from "types/hook";

const useAutoActionHandler: UseAutoActionHandlerType = <T, K>(
  { action, timmer, actionState = true, once = true, delayTime, rightNow = false, currentRef, addListener, removeListener }: UseAutoActionHandlerProps<T, K>,
  ...deps: any[]
) => {
  const actionStateRef = useRef<boolean>();
  actionStateRef.current = actionState;
  useEffect(() => {
    // 定时器
    if (timmer) {
      const actionCallback = () => {
        if (actionStateRef.current) action();
      };
      if (delayTime === undefined) {
        log("timmer delayTime not set ---> useAutoActionHandler", "warn");
        delayTime = 0;
      }
      if (rightNow) {
        actionCallback();
      }
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
          if (rightNow) action();
          const currentEle = currentRef?.current;
          addListener(action, currentEle!);
          return () => removeListener(action, currentEle!);
        }
      }
    } else if (rightNow) {
      if (actionStateRef.current) {
        action();
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
            setHeight(ele.offsetHeight);
            ele.style.height = "0px";
          }
        }),
      300,
      { leading: true }
    ),
    [breakPoint]
  );
  const addListenerCallback = useCallback<(action: () => void) => void>((action) => window.addEventListener("resize", action), []);
  const removeListenerCallback = useCallback<(action: () => void) => void>((action) => window.removeEventListener("resize", action), []);
  useAutoActionHandler({
    action: setHeightCallback,
    actionState: bool,
    rightNow: true,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
  });
  return { ref, height };
};

const useAutoLoadCheckcodeImg: UseAutoLoadCheckcodeImgType = <T extends HTMLImageElement>({ imgUrl, strUrl, state = true }: UseAutoLoadCheckcodeImgProps) => {
  const ref = useRef<T>(null);
  const loadActionCallback = useCallback<() => void>(
    debounce(
      () => actionHandler<T, void, void>(ref.current, (ele) => loadImg({ imgUrl, strUrl, imgElement: ele, state })),
      400,
      { leading: true } // 立即执行一次
    ),
    [state]
  );
  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
    []
  );
  useAutoActionHandler(
    {
      action: loadActionCallback,
      rightNow: true,
      addListener: addListenerCallback,
      removeListener: removeListenerCallback,
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
  const addListenerCallback = useCallback<(action: () => void) => void>((action) => window.addEventListener("scroll", action), []);
  const removeListenerCallback = useCallback<(action: () => void) => void>((action) => window.removeEventListener("scroll", action), []);
  useAutoActionHandler({
    action: autoSetValueHandler,
    rightNow: true,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
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
          ele.style.height = `${lastHeight}px`;
          setHeight(targetHeight);
        }),
      400,
      { leading: true }
    ),
    [maxHeight]
  );
  const addListenerCallback = useCallback<(action: () => void) => void>((action) => window.addEventListener("resize", action), []);
  const removeListenerCallback = useCallback<(action: () => void) => void>((action) => window.removeEventListener("resize", action), []);
  useAutoActionHandler(
    {
      action: setHeightCallback,
      rightNow: true,
      addListener: addListenerCallback,
      removeListener: removeListenerCallback,
    },
    ...deps
  );
  return [currentRef, height];
};

const useAutoLoadRandomImg: UseAutoLoadRandomImgType = ({ imgUrl, initUrl }) => {
  const fail = useFailToast();
  const { bool, show, hide } = useBool();
  const ref = useRef<HTMLImageElement>(null);
  const request = useMemo(() => createRequest({ apiPath: imgUrl, header: { apiToken: true }, cache: false }), [imgUrl]);
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

  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    []
  );

  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
    []
  );

  useEffect(() => {
    if (initUrl) {
      actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => (ele.src = initUrl));
    }
  }, [initUrl]);

  useEffect(() => {
    actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.addEventListener("load", show));
    () => actionHandler<HTMLImageElement, void, void>(ref.current, (ele) => ele.removeEventListener("load", show));
  }, []);

  useAutoActionHandler({
    action: loadSrc,
    rightNow: initUrl ? false : true,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
  });
  return [ref, bool];
};

export { useAutoActionHandler, useAutoSetHeaderHeight, useAutoLoadCheckcodeImg, useAutoShowAndHide, useAutoSetHeight, useAutoLoadRandomImg };
