import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/dist/client/router";
import tocbot from "tocbot";
import { toCanvas } from "qrcode";
import { apiName } from "config/api";
import { cancel, delay } from "utils/delay";
import { actionHandler } from "utils/action";
import { addIdForHeads } from "utils/markdown";
import { createRequest } from "utils/fetcher";
import { formSerialize, getRandom } from "utils/data";
import { useCurrentUser } from "./useUser";
import { useOverlayOpen } from "./useOverlay";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSucessToast } from "./useToast";
import { ApiRequestResult } from "types/utils";
import {
  UseBlogMenuType,
  UseAutoScrollType,
  UseLinkToImgType,
  UsePublishType,
  UseEditorType,
  UseInputToImageModuleType,
  UseUpdateBlogReadType,
  UseLikeToPayModuleType,
} from "types/hook";

import "tocbot/dist/tocbot.css";

let useBlogMenu: UseBlogMenuType;

let useAutoScrollTop: UseAutoScrollType;

let useAutoScrollBottom: UseAutoScrollType;

let useLinkToImg: UseLinkToImgType;

let useEditor: UseEditorType;

let usePublish: UsePublishType;

let useInputToImageModule: UseInputToImageModuleType;

let useUpdateBlog: UsePublishType;

let useUpdateBlogRead: UseUpdateBlogReadType;

let useLikeToPayModule: UseLikeToPayModuleType;

useBlogMenu = (className) => {
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
  }, []);
  return bool;
};

useAutoScrollTop = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const scrollTopCallback = useCallback<() => void>(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
    []
  );
  useAutoActionHandler({
    action: scrollTopCallback,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
  });
  return ref;
};

useAutoScrollBottom = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const scrollTopCallback = useCallback<() => void>(() => {
    window.scrollTo({
      top: document.body.offsetHeight - 1000,
      behavior: "smooth",
    });
  }, []);
  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.addEventListener("click", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.removeEventListener("click", action)),
    []
  );
  useAutoActionHandler({
    action: scrollTopCallback,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
  });
  return ref;
};

useLinkToImg = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    actionHandler<T, void, void>(ref.current, (ele) => toCanvas(ele, location.href));
  }, []);
  return ref;
};

useEditor = (id) => {
  const mdId = `#editor_${id}_md`;
  // 创建DOM观察者对象，观察DOM的class变化，执行对应的操作
  const observer = new MutationObserver(function (mutationsList) {
    // 遍历出所有的MutationRecord对象
    mutationsList.forEach(function (mutation) {
      if (mutation.attributeName === "class") {
        if ((mutation.target as HTMLDivElement).classList.contains("full")) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "auto";
        }
      }
    });
  });
  const keydonwHandler = useCallback<(e: KeyboardEvent) => void>((e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, " ".repeat(2));
    }
  }, []);
  useEffect(() => {
    const init = () =>
      delay(
        100,
        () =>
          actionHandler<HTMLTextAreaElement, void, void>(
            document.querySelector(mdId) as HTMLTextAreaElement,
            (ele) => ele.addEventListener("keydown", keydonwHandler),
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
      actionHandler<HTMLTextAreaElement, void, void>(document.querySelector(mdId) as HTMLTextAreaElement, (ele) =>
        ele.removeEventListener("keydown", keydonwHandler)
      );
    };
  }, []);
};

usePublish = ({ request, id }) => {
  const router = useRouter();
  const fail = useFailToast();
  const success = useSucessToast();
  const htmlId = `#editor_${id}_html`;
  const ref = useRef<HTMLFormElement>(null);
  const { userId } = useCurrentUser();
  const submit = useCallback(
    () =>
      actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(
        ref.current,
        (ele) => {
          if (!userId) {
            return fail("登录失效，请重新登录！");
          } else {
            const blogPreview = ele.querySelector(htmlId)?.textContent;
            return request({
              data: { ...formSerialize(ele), blogPreview, blogId: getRandom(1000).toString(16) },
              query: { userId },
              apiPath: apiName.publishBlog,
            })
              .run<ApiRequestResult<string>>()
              .then(({ code, data }) => {
                if (code === 0) {
                  delay(800, () => router.push("/"));
                  return success(data.toString());
                } else {
                  return fail(data.toString());
                }
              })
              .catch((e) => fail(e.toString()));
          }
        },
        () => fail("form元素不存在...")
      ),
    [userId]
  );
  return [ref, submit];
};

useInputToImageModule = ({ body, className, appendHandler, inputRef }) => {
  const open = useOverlayOpen();
  const select = useCallback<() => void>(() => {
    open({ head: "选择图片，点击刷新", body: body(appendHandler)(inputRef), className });
  }, [body]);
  return select;
};

useUpdateBlog = ({ request, id }) => {
  const router = useRouter();
  const fail = useFailToast();
  const success = useSucessToast();
  const htmlId = `#editor_${id}_html`;
  const ref = useRef<HTMLFormElement>(null);
  const submit = useCallback(
    () =>
      actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(
        ref.current,
        (ele) => {
          const blogPreview = ele.querySelector(htmlId)?.textContent;
          return request({ data: { newProps: { ...formSerialize(ele), blogPreview, blogId: id } }, apiPath: apiName.updataBlog })
            .run<ApiRequestResult<string>>()
            .then(({ data, code }) => {
              if (code === 0) {
                delay(800, () => router.push("/"));
                return success(data.toString());
              } else {
                return fail(data.toString());
              }
            })
            .catch((e) => fail(e.toString()));
        },
        () => fail(`form元素不存在...`)
      ),
    [request, id]
  );

  return [ref, submit];
};

useUpdateBlogRead = (blogId) => {
  const fail = useFailToast();
  const success = useSucessToast();
  useEffect(() => {
    const request = createRequest({ method: "post", apiPath: apiName.addBlogRead, data: { blogId } });
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
  }, [blogId]);
};

useLikeToPayModule = ({ body, className }) => {
  const opne = useOverlayOpen();
  const click = useCallback(() => {
    opne({ head: "感谢", body, className });
  }, [body]);

  return click;
};

export {
  useBlogMenu,
  useAutoScrollTop,
  useAutoScrollBottom,
  useLinkToImg,
  useEditor,
  usePublish,
  useInputToImageModule,
  useUpdateBlog,
  useUpdateBlogRead,
  useLikeToPayModule,
};
