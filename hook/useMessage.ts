import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { childMessageLength } from "config/message";
import { log } from "utils/log";
import { formSerialize, getRandom } from "utils/data";
import { actionHandler } from "utils/action";
import { createRequest } from "utils/fetcher";
import { useBool } from "./useData";
import { useUserRequest } from "./useUser";
import { useOverlayOpen } from "./useOverlay";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSuccessToast } from "./useToast";
import type { ApiRequestResult, AutoRequestType } from "types/utils";
import type { ChildMessageProps, PrimaryMessageProps } from "types/components";

interface UseChildMessageType {
  (props: ChildMessageProps[]): { messageProps: ChildMessageProps[]; more: boolean; loadMore: () => void };
}
type MyInputELement = HTMLInputElement | HTMLTextAreaElement;
interface UseJudgeInputValueType {
  <T extends MyInputELement>(ref?: RefObject<T>, ...deps: any[]): { canSubmit: boolean; ref?: RefObject<T> };
}
export interface UsePutToCheckCodeModuleBody {
  ({ request, requestCallback, blogId }: { request: AutoRequestType; requestCallback: () => void; blogId: string }): (closeHandler: () => void) => JSX.Element;
}
interface UsePutToCheckCodeModuleProps {
  isMd?: number;
  blogId: string;
  className?: string;
  submitCallback?: () => void;
  body: UsePutToCheckCodeModuleBody;
}
interface UsePutToCheckCodeModuleType {
  (props: UsePutToCheckCodeModuleProps, ...deps: any[]): {
    formRef: RefObject<HTMLFormElement>;
    textAreaRef?: RefObject<HTMLTextAreaElement>;
    canSubmit: boolean;
  };
}
interface UseCheckCodeModuleToSubmitProps {
  blogId: string;
  request: AutoRequestType;
  closeHandler: () => void;
  requestCallback: () => void;
}
interface UseCheckCodeModuleToSubmitType {
  (props: UseCheckCodeModuleToSubmitProps): {
    loading: boolean;
    formRef: RefObject<HTMLFormElement>;
    inputRef?: RefObject<HTMLInputElement>;
    canSubmit: boolean;
  };
}
export interface UseMessageToModuleBody<T> {
  ({ props }: { props: T }): (closeHandler: () => void) => JSX.Element;
}
interface UseMessageToModuleProps<T> {
  className: string;
  body: UseMessageToModuleBody<T>;
}
interface UseMessageToModuleType {
  <T>(props: UseMessageToModuleProps<T>): (props: T) => void;
}
interface UseReplayModuleToSubmitProps<T> {
  props: T;
  isMd?: number;
  toPrimary?: number;
  request: AutoRequestType;
  closeHandler: () => void;
}
interface UseReplayModuleToSubmitType {
  <T extends PrimaryMessageProps | ChildMessageProps, F extends MyInputELement, O extends MyInputELement>(props: UseReplayModuleToSubmitProps<T>): {
    input1?: RefObject<F>;
    input2?: RefObject<O>;
    formRef: RefObject<HTMLFormElement>;
    loading: boolean;
    canSubmit: boolean;
  };
}
interface UseDeleteModuleToSubmitProps<T> {
  request: AutoRequestType;
  closeHandler: () => void;
  props: T;
}
interface UseDeleteModuleToSubmitType {
  <T extends PrimaryMessageProps | ChildMessageProps>(props: UseDeleteModuleToSubmitProps<T>): { formRef: RefObject<HTMLFormElement>; loading: boolean };
}
interface UseUpdateModuleToSubmitProps<T> {
  props: T;
  closeHandler: () => void;
  request: AutoRequestType;
}
interface UseUpdateModuleToSubmitType {
  <T extends PrimaryMessageProps | ChildMessageProps, F extends MyInputELement, O extends MyInputELement>(props: UseUpdateModuleToSubmitProps<T>): {
    input1?: RefObject<F>;
    input2?: RefObject<O>;
    formRef: RefObject<HTMLFormElement>;
    loading: boolean;
    canSubmit: boolean;
  };
}

export const useChildMessage: UseChildMessageType = (props) => {
  const [page, setPage] = useState<number>(1);
  const [messageProps, setMessageProps] = useState<ChildMessageProps[]>([]);
  const more = page * childMessageLength < props.length;
  useMemo(() => setMessageProps(props.slice(0, page * childMessageLength)), [page, props]);
  const loadMore = useCallback(() => setPage((last) => last + 1), []);
  return { messageProps, more, loadMore };
};

export const useJudgeInputValue: UseJudgeInputValueType = <T extends MyInputELement>(forWareRef?: RefObject<T>, ...deps: any[]) => {
  const ref = useRef<T>(null);
  const [bool, setBool] = useState<boolean>(false);
  const targetRef = forWareRef || ref;
  useAutoActionHandler(
    {
      rightNow: true,
      actionCallback: () =>
        actionHandler<T, void>(targetRef.current, (ele) => {
          if (ele instanceof HTMLFormElement) {
            log(`element not support autoJudge submit! ${ele}`, "error");
          } else {
            !!ele.value.trim().length ? setBool(true) : setBool(false);
          }
        }),
      addListenerCallback: (action) => actionHandler<T, void>(targetRef.current, (ele) => ele.addEventListener("input", action)),
      removeListenerCallback: (action) => actionHandler<T, void>(targetRef.current, (ele) => ele.removeEventListener("input", action)),
    },
    ...deps
  );
  return { canSubmit: bool, ref };
};

export const usePutToCheckCodeModule: UsePutToCheckCodeModuleType = ({
  blogId,
  body,
  className = "",
  isMd = 0,
  submitCallback,
}: UsePutToCheckCodeModuleProps) => {
  const open = useOverlayOpen();
  const htmlId = `#editor_content_html`;
  const submitRef = useRef<boolean>(false);
  const mdRef = useRef<number>(Number(isMd));
  const formRef = useRef<HTMLFormElement>(null);
  const { ref: textAreaRef, canSubmit } = useJudgeInputValue<HTMLTextAreaElement>(undefined, isMd);
  const request = useUserRequest({ method: "post", apiPath: apiName.putPrimaryMessage, data: { blogId }, cache: false });

  mdRef.current = Number(isMd);
  submitRef.current = canSubmit;

  useAutoActionHandler<Event, void>({
    actionCallback: (e) => {
      e?.preventDefault();
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => {
        if (submitRef.current) {
          return open({
            head: "验证码",
            body: body({
              request: request({ data: { ...formSerialize(ele), isMd: mdRef.current, preview: mdRef.current && ele.querySelector(htmlId)?.textContent } }),
              requestCallback: () => {
                actionHandler<HTMLTextAreaElement, void>(textAreaRef?.current, (ele) => {
                  ele.value = "";
                });
                submitCallback && submitCallback();
              },
              blogId,
            }),
            height: 60,
            className,
          });
        } else {
          return log("can not submit", "warn");
        }
      });
    },
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { formRef, textAreaRef, canSubmit };
};

export const useCheckCodeModuleToSubmit: UseCheckCodeModuleToSubmitType = ({
  blogId,
  request,
  closeHandler,
  requestCallback,
}: UseCheckCodeModuleToSubmitProps) => {
  const pushFail = useFailToast();
  const pushSuccess = useSuccessToast();
  const { bool, show, hide } = useBool();
  const formRef = useRef<HTMLFormElement>(null);
  const { canSubmit, ref: inputRef } = useJudgeInputValue<HTMLInputElement>();
  const stateRef = useRef<{ loading: boolean; canSubmit: boolean }>({ loading: false, canSubmit: false });

  stateRef.current.canSubmit = canSubmit;
  stateRef.current.loading = bool;

  const flashData = useCallback(() => {
    const primaryRequest = createRequest({ apiPath: apiName.primaryMessage, query: { blogId } });
    primaryRequest.deleteCache();
    mutate(primaryRequest.cacheKey);
    requestCallback();
    setTimeout(closeHandler, 0);
  }, [blogId, closeHandler, requestCallback]);

  useAutoActionHandler<Event, void>(
    {
      actionCallback: (e) => {
        e?.preventDefault();
        if (stateRef.current.loading) {
          return pushFail("加载中");
        } else if (!stateRef.current.canSubmit) {
          return pushFail("不能提交");
        } else {
          return actionHandler<HTMLFormElement, Promise<void>>(formRef.current, (ele) => {
            show();
            return request({ data: { ...formSerialize(ele), commentId: getRandom(1000).toString(16) } })
              .run<ApiRequestResult<string>>()
              .then(({ code, data }) => {
                if (code === 0) {
                  flashData();
                  return pushSuccess("提交成功");
                } else {
                  return pushFail(`提交失败: ${data.toString()}`);
                }
              })
              .catch((e) => pushFail(`发生错误: ${e.toString()}`))
              .finally(hide);
          });
        }
      },
      addListenerCallback: (action: (e: Event) => void) => {
        actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
      },
      removeListenerCallback: (action: (e: Event) => void) => {
        actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
      },
    },
    request
  );
  return { formRef, inputRef, canSubmit, loading: bool };
};

export const useMessageToReplayModule: UseMessageToModuleType = <T>({ body, className }: UseMessageToModuleProps<T>) => {
  const open = useOverlayOpen();
  return useCallback<(props: T) => void>((props) => open({ head: "回复", body: body({ props }), className }), [body, className, open]);
};

export const useReplayModuleToSubmit: UseReplayModuleToSubmitType = <
  T extends PrimaryMessageProps | ChildMessageProps,
  F extends MyInputELement,
  O extends MyInputELement
>({
  props,
  request,
  isMd = 0,
  closeHandler,
  toPrimary = 0,
}: UseReplayModuleToSubmitProps<T>) => {
  const mdRef = useRef<number>(isMd);
  const pushFail = useFailToast();
  const pushSuccess = useSuccessToast();
  const { bool, show, hide } = useBool();
  const formRef = useRef<HTMLFormElement>(null);
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");
  const stateRef = useRef<{ loading: boolean; canSubmit: boolean }>({ loading: false, canSubmit: false });
  const { ref: input1, canSubmit: canSubmit1 } = useJudgeInputValue<F>(undefined, isMd);
  const { ref: input2, canSubmit: canSubmit2 } = useJudgeInputValue<O>();

  mdRef.current = isMd;
  stateRef.current.canSubmit = canSubmit1 && canSubmit2;
  stateRef.current.loading = bool;

  const flashData = useCallback(() => {
    const childMessageRequest = createRequest({
      apiPath: apiName.childMessage,
      query: { primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId },
    });
    childMessageRequest.deleteCache();
    mutate(childMessageRequest.cacheKey);
    setTimeout(closeHandler, 0);
  }, [isChild, props, closeHandler]);

  const submit = useCallback<(e?: Event) => void>(
    (e) => {
      e?.preventDefault();
      if (stateRef.current.loading) {
        return pushFail("加载中");
      } else if (!stateRef.current.canSubmit) {
        return pushFail("不能提交");
      } else {
        return actionHandler<HTMLFormElement, Promise<void>>(formRef.current, (ele) => {
          show();
          const requestPromise = request({
            data: {
              ...formSerialize(ele),
              preview: mdRef.current && ele.querySelector("#editor_content_html")?.textContent,
              blogId: props.blogId,
              primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId,
              toIp: props.fromIp,
              toUserId: props.fromUserId,
              commentId: getRandom(1000).toString(16),
              isMd: mdRef.current,
              toPrimary,
            },
          });
          return requestPromise
            .run<ApiRequestResult<string>>()
            .then(({ code, data }) => {
              if (code === 0) {
                flashData();
                return pushSuccess("提交成功");
              } else {
                return pushFail(`提交失败: ${data.toString()}`);
              }
            })
            .catch((e) => pushFail(`发生错误: ${e.toString()}`))
            .finally(hide);
        });
      }
    },
    [pushFail, show, request, props, isChild, toPrimary, hide, flashData, pushSuccess]
  );

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { input1, input2, submit, canSubmit: canSubmit1 && canSubmit2, loading: bool, formRef };
};

export const useMessageToDeleteModule: UseMessageToModuleType = <T>({ body, className }: UseMessageToModuleProps<T>) => {
  const open = useOverlayOpen();
  return useCallback<(props: T) => void>((props) => open({ head: "删除", body: body({ props }), className }), [body, className, open]);
};

export const useDeleteModuleToSubmit: UseDeleteModuleToSubmitType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  request,
  closeHandler,
}: UseDeleteModuleToSubmitProps<T>) => {
  const pushFail = useFailToast();
  const pushSuccess = useSuccessToast();
  const { show, hide, bool } = useBool();
  const loadingRef = useRef<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  loadingRef.current = bool;
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");

  const flashData = useCallback(() => {
    if (isChild) {
      // 子评论
      const childMessageRequest = createRequest({ apiPath: apiName.childMessage, query: { primaryCommentId: (props as ChildMessageProps).primaryCommentId } });
      childMessageRequest.deleteCache();
      mutate(childMessageRequest.cacheKey);
    } else {
      const primaryMessageRequest = createRequest({ apiPath: apiName.primaryMessage, query: { blogId: props.blogId } });
      primaryMessageRequest.deleteCache();
      mutate(primaryMessageRequest.cacheKey);
    }
    setTimeout(closeHandler, 0);
  }, [closeHandler, isChild, props]);

  useAutoActionHandler<Event, void>(
    {
      actionCallback: (e) => {
        e?.preventDefault();
        if (loadingRef.current) {
          return pushFail("加载中");
        } else {
          return actionHandler<HTMLFormElement, Promise<void>>(formRef.current, () => {
            show();
            return request({
              data: {
                isChild,
                blogId: props.blogId,
                primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : "",
                commentId: props.commentId,
              },
            })
              .run<ApiRequestResult<string>>()
              .then(({ code, data }) => {
                if (code === 0) {
                  flashData();
                  return pushSuccess(`删除${isChild ? "子评论" : "主评论"}成功, commentId: ${props.commentId}`);
                } else {
                  return pushFail(`删除${isChild ? "子评论" : "主评论"}失败, commentId: ${props.commentId}, message: ${data.toString()}`);
                }
              })
              .catch((e) => pushFail(`删除${isChild ? "子评论" : "主评论"}出错, commentId: ${props.commentId}, error: ${e.toString()}`))
              .finally(hide);
          });
        }
      },
      addListenerCallback: (action: (e: Event) => void) => {
        actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
      },
      removeListenerCallback: (action: (e: Event) => void) => {
        actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
      },
    },
    request,
    isChild,
    props
  );

  return { formRef, loading: bool };
};

export const useMessageToUpdateModule: UseMessageToModuleType = <T>({ body, className }: UseMessageToModuleProps<T>) => {
  const open = useOverlayOpen();
  return useCallback<(props: T) => void>((props) => open({ head: "更新", body: body({ props }), className }), [body, className, open]);
};

export const useUpdateModuleToSubmit: UseUpdateModuleToSubmitType = <
  T extends PrimaryMessageProps | ChildMessageProps,
  F extends MyInputELement,
  O extends MyInputELement
>({
  props,
  request,
  closeHandler,
}: UseUpdateModuleToSubmitProps<T>) => {
  const pushFail = useFailToast();
  const pushSuccess = useSuccessToast();
  const { bool, show, hide } = useBool();
  const formRef = useRef<HTMLFormElement>(null);
  const { ref: input1, canSubmit: canSubmit1 } = useJudgeInputValue<F>();
  const { ref: input2, canSubmit: canSubmit2 } = useJudgeInputValue<O>();
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");
  const stateRef = useRef<{ loading: boolean; canSubmit: boolean }>({ loading: false, canSubmit: false });

  stateRef.current.canSubmit = canSubmit1 && canSubmit2;
  stateRef.current.loading = bool;

  const flashData = useCallback(() => {
    if (isChild) {
      // 子评论
      const childMessageRequest = createRequest({ apiPath: apiName.childMessage, query: { primaryCommentId: (props as ChildMessageProps).primaryCommentId } });
      childMessageRequest.deleteCache();
      mutate(childMessageRequest.cacheKey);
    } else {
      const primaryMessageRequest = createRequest({ apiPath: apiName.primaryMessage, query: { blogId: props.blogId } });
      primaryMessageRequest.deleteCache();
      mutate(primaryMessageRequest.cacheKey);
    }
    setTimeout(closeHandler, 0);
  }, [isChild, closeHandler, props]);

  const submit = useCallback<(e?: Event) => void>(
    (e) => {
      e?.preventDefault();
      if (stateRef.current.loading) {
        return pushFail("加载中");
      } else if (!stateRef.current.canSubmit) {
        return pushFail("不能提交");
      } else {
        if (input1 && input1.current && (input1.current.value === props.content || input1.current.value === "")) {
          return pushFail("输入的内容没有变化或者为空");
        }
        return actionHandler<HTMLFormElement, Promise<void>>(formRef.current, (ele) => {
          show();
          const requestPromise = props.isMd
            ? request({
                data: {
                  ...formSerialize(ele),
                  isMd: props.isMd,
                  preview: ele.querySelector("#editor_newContent_html")?.textContent,
                  isChild,
                  blogId: props.blogId,
                  commentId: props.commentId,
                  primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : "",
                },
              })
            : request({
                data: {
                  ...formSerialize(ele),
                  isChild,
                  blogId: props.blogId,
                  commentId: props.commentId,
                  primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : "",
                },
              });
          return requestPromise
            .run<ApiRequestResult<string>>()
            .then(({ code, data }) => {
              if (code === 0) {
                flashData();
                return pushSuccess(`更新成功, old: ${props.content} --> new: ${input1?.current?.value}`);
              } else {
                return pushFail(`更新失败, ${data.toString()}`);
              }
            })
            .catch((e) => pushFail(`更新出错, ${e.toString()}`))
            .finally(hide);
        });
      }
    },
    [flashData, hide, input1, isChild, props, pushFail, pushSuccess, request, show]
  );

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { input1, input2, submit, canSubmit: canSubmit1 && canSubmit2, loading: bool, formRef };
};
