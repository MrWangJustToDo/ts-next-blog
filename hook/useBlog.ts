import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import isEqual from "lodash/isEqual";
import { useRouter } from "next/dist/client/router";
import tocbot from "tocbot";
import { toCanvas } from "qrcode";
import { apiName } from "config/api";
import { cancel, delay } from "utils/delay";
import { actionHandler } from "utils/action";
import { addIdForHeads } from "utils/markdown";
import { createRequest } from "utils/fetcher";
import { formSerialize, getRandom, transformFromFieldToBlog } from "utils/data";
import { useCurrentUser } from "./useUser";
import { useOverlayOpen } from "./useOverlay";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSuccessToast } from "./useToast";
import type { ApiRequestResult, AutoRequestType } from "types/utils";

import "tocbot/dist/tocbot.css";

interface UseBlogMenuType {
  (className: string): boolean;
}
interface UseAutoScrollType {
  <T extends HTMLElement>(): RefObject<T>;
}
interface UseLinkToImgType {
  <T extends HTMLElement>(): RefObject<T>;
}
interface UseEditorType {
  (id: string): void;
}
interface UsePublishProps {
  id: string;
  request: AutoRequestType;
}
interface UsePublishType {
  (props: UsePublishProps): [RefObject<HTMLFormElement>, () => Promise<void>];
}
interface UseUpdateBlogReadType {
  (props: string): void;
}
interface UseLikeToPayModuleProps {
  body: JSX.Element;
  className?: string;
}
interface UseLikeToPayModuleType {
  (props: UseLikeToPayModuleProps): () => void;
}
interface UseInputToImageModuleProps {
  className?: string;
  body: (ref: RefObject<HTMLInputElement>) => (closeHandler: () => void) => JSX.Element;
}
interface UseInputToImageModuleType {
  (props: UseInputToImageModuleProps): [RefObject<HTMLInputElement>, () => void];
}

export const useBlogMenu: UseBlogMenuType = (className) => {
  const [bool, setBool] = useState<boolean>(false);
  useEffect(() => {
    const added = addIdForHeads(className);
    if (added) {
      setBool(true);
      tocbot.init({
        // Where to render the table of contents.
        tocSelector: ".js-toc",
        // Where to grab the headings to build the table of contents.
        contentSelector: className,
        // Which headings to grab inside of the contentSelector element.
        headingSelector: "h1, h2, h3, h4",
        // For headings inside relative or absolute positioned containers within content.
        hasInnerContainers: true,
      });
    }
    const re = tocbot.destroy.bind(tocbot);
    return () => (added ? re() : void 0);
  }, [className]);
  return bool;
};

export const useAutoScrollTop: UseAutoScrollType = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useAutoActionHandler({
    actionCallback: () =>
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      }),
    addListenerCallback: (action) => actionHandler<T, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    removeListenerCallback: (action) => actionHandler<T, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
  });
  return ref;
};

export const useAutoScrollBottom: UseAutoScrollType = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useAutoActionHandler({
    actionCallback: () =>
      window.scrollTo({
        top: document.body.offsetHeight - 1000,
        behavior: "smooth",
      }),
    addListenerCallback: (action) => actionHandler<T, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    removeListenerCallback: (action) => actionHandler<T, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
  });
  return ref;
};

export const useLinkToImg: UseLinkToImgType = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    actionHandler<T, void>(ref.current, (ele) => toCanvas(ele, location.href));
  }, []);
  return ref;
};

export const useEditor: UseEditorType = (id) => {
  const mdId = `#editor_${id}_md`;
  const isOverflowRef = useRef(false);

  useEffect(() => {
    // 判断当前是否需要进行overflow切换
    isOverflowRef.current = document.body.style.overflow === "hidden";
  }, []);

  useEffect(() => {
    // 创建DOM观察者对象，观察DOM的class变化，执行对应的操作
    const observer = new MutationObserver(function (mutationsList) {
      // 遍历出所有的MutationRecord对象
      mutationsList.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          if ((mutation.target as HTMLDivElement).classList.contains("full")) {
            if (!isOverflowRef.current) {
              document.body.style.overflow = "hidden";
            }
          } else {
            if (!isOverflowRef.current) {
              document.body.style.overflow = "auto";
            }
          }
        }
      });
    });
    const keydownHandler = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        document.execCommand("insertText", false, " ".repeat(2));
      }
    };
    const init = () =>
      delay(
        100,
        () =>
          actionHandler<HTMLTextAreaElement, void, void>(
            document.querySelector(mdId) as HTMLTextAreaElement,
            (ele) => ele.addEventListener("keydown", keydownHandler),
            init
          ),
        "initEditor"
      );
    const listen = () =>
      delay(
        200,
        () =>
          actionHandler<HTMLDivElement, void, void>(
            document.querySelector(`#editor_${id}`) as HTMLDivElement,
            (ele) => observer.observe(ele, { attributes: true }),
            listen
          ),
        "initObserve"
      );
    init();
    listen();
    return () => {
      cancel("initEditor");
      cancel("initObserve");
      observer.disconnect();
      actionHandler<HTMLTextAreaElement, void>(document.querySelector(mdId) as HTMLTextAreaElement, (ele) =>
        ele.removeEventListener("keydown", keydownHandler)
      );
    };
  }, [id, mdId]);
};

export const usePublish: UsePublishType = ({ request, id }) => {
  const router = useRouter();
  const fail = useFailToast();
  const success = useSuccessToast();
  const htmlId = `#editor_${id}_html`;
  const ref = useRef<HTMLFormElement>(null);
  const { userId } = useCurrentUser();
  const submit = useCallback(
    () =>
      actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(
        ref.current,
        (ele) => {
          if (!userId) {
            fail("登录失效，请重新登录！");
            return Promise.resolve();
          } else {
            const blogPreview = ele.querySelector(htmlId)?.textContent;
            return request({
              data: { ...formSerialize(ele), blogPreview, blogId: getRandom(1000).toString(16) },
              query: { userId },
            })
              .run<ApiRequestResult<string>>()
              .then(({ code, data }) => {
                if (code === 0) {
                  delay(800, () => router.push("/"));
                  success(data.toString());
                } else {
                  fail(data.toString());
                }
              })
              .catch((e) => {
                fail(e.toString());
              });
          }
        },
        () => {
          fail("form元素不存在...");
          return Promise.resolve();
        }
      ),
    [fail, htmlId, request, router, success, userId]
  );
  return [ref, submit];
};

export const useInputToImageModule: UseInputToImageModuleType = ({ body, className }) => {
  const open = useOverlayOpen();
  const ref = useRef<HTMLInputElement>(null);
  const select = useCallback(() => {
    open({ head: "选择图片，点击刷新", body: body(ref), className });
  }, [body, className, open]);
  return [ref, select];
};

export const useUpdateBlog: UsePublishType = ({ request, id }) => {
  const router = useRouter();
  const fail = useFailToast();
  const success = useSuccessToast();
  const htmlId = `#editor_${id}_html`;
  const ref = useRef<HTMLFormElement>(null);
  const submit = useCallback(
    () =>
      actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(
        ref.current,
        (ele) => {
          const blogPreview = ele.querySelector(htmlId)?.textContent;
          return request({ data: { newProps: { ...transformFromFieldToBlog(formSerialize(ele)), blogPreview, blogId: id } } })
            .advance(({ data }) => {
              const { oldProps, newProps } = data as { oldProps: any; newProps: any };
              const newOldProps: { [props: string]: any } = { blogId: oldProps.blogId };
              const newNewProps: { [props: string]: any } = { blogId: newProps.blogId };
              Object.keys(newProps).forEach((key) => {
                if (!isEqual(oldProps[key], newProps[key])) {
                  newOldProps[key] = oldProps[key];
                  newNewProps[key] = newProps[key];
                }
              });
              return { data: { oldProps: newOldProps, newProps: newNewProps }, apiPath: apiName.updateBlog_v2 };
            })
            .run<ApiRequestResult<string>>()
            .then(({ data, code }) => {
              if (code === 0) {
                request()
                  .advance(() => ({ apiPath: apiName.userHome }))
                  .deleteCache();
                request()
                  .advance(() => ({ apiPath: apiName.home, query: false }))
                  .deleteCache();
                delay(400, () => router.push("/"));
                success(data.toString());
              } else {
                fail(data.toString());
              }
            })
            .catch((e) => {
              fail(e.toString());
              return Promise.resolve();
            });
        },
        () => {
          fail(`组件已卸载`);
          return Promise.resolve();
        }
      ),
    [htmlId, request, id, success, router, fail]
  );

  return [ref, submit];
};

export const useUpdateBlogRead: UseUpdateBlogReadType = (blogId) => {
  const fail = useFailToast();
  const success = useSuccessToast();
  const request = useMemo(() => createRequest({ method: "post", apiPath: apiName.addBlogRead, data: { blogId } }), [blogId]);
  useEffect(() => {
    delay(1000, () => {
      request
        .run<ApiRequestResult<string>>()
        .then(({ code, data }) => {
          if (code === 0) {
            success("更新阅读次数成功");
          } else {
            fail(`更新阅读次数失败, ${data.toString()}`);
          }
        })
        .catch((e) => fail(`更新阅读次数出错, ${e.toString()}`));
    });
  }, [fail, request, success]);
};

export const useLikeToPayModule: UseLikeToPayModuleType = ({ body, className }) => {
  const open = useOverlayOpen();
  const click = useCallback(() => {
    open({ head: "感谢", body, className });
  }, [body, open, className]);

  return click;
};
