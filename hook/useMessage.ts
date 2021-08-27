import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { childMessageLength } from "config/message";
import { log } from "utils/log";
import { formSerialize, getRandom } from "utils/data";
import { actionHandler } from "utils/action";
import { createRequest } from "utils/fetcher";
import { useUserRequest } from "./useUser";
import { useOverlayOpen } from "./useOverlay";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSucessToast } from "./useToast";
import { ApiRequestResult } from "types/utils";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";
import {
  UseChildMessageType,
  MyInputELement,
  UseJudgeInputValueType,
  UsePutToCheckcodeModuleType,
  UseCheckcodeModuleToSubmitProps,
  UseCheckcodeModuleToSubmitType,
  UseMessageToModuleProps,
  UseMessageToModuleType,
  UseReplayModuleToSubmitProps,
  UseReplayModuleToSubmitType,
  UsePutToCheckcodeModuleProps,
  UseDeleteModuleToSubmitType,
  UseDeleteModuleToSubmitProps,
  UseUpdateModuleToSubmitType,
  UseUpdateModuleToSubmitProps,
} from "types/hook";
import { useBool } from "./useData";

const useChildMessage: UseChildMessageType = (props) => {
  const [page, setPage] = useState<number>(1);
  const [messageProps, setMessageProps] = useState<ChildMessageProps[]>([]);
  const more = page * childMessageLength < props.length;
  useMemo(() => setMessageProps(props.slice(0, page * childMessageLength)), [page, props]);
  const loadMore = useCallback(() => setPage((last) => last + 1), []);
  return { messageProps, more, loadMore };
};

const useJudgeInputValue: UseJudgeInputValueType = <T extends MyInputELement>(forWareRef?: RefObject<T>, ...deps: any[]) => {
  const ref = useRef<T>(null);
  const [bool, setBool] = useState<boolean>(false);
  const targetRef = forWareRef || ref;
  const judgeValue = useCallback<() => void>(
    () =>
      actionHandler<T, void, void>(targetRef.current, (ele) => {
        if (ele instanceof HTMLFormElement) {
          log(`element not support autoJudge submit! ${ele}`, "error");
        } else {
          !!ele.value.trim().length ? setBool(true) : setBool(false);
        }
      }),
    []
  );
  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(targetRef.current, (ele) => ele.addEventListener("input", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(targetRef.current, (ele) => ele.removeEventListener("input", action)),
    []
  );
  useAutoActionHandler(
    {
      rightNow: true,
      action: judgeValue,
      addListener: addListenerCallback,
      removeListener: removeListenerCallback,
    },
    ...deps
  );
  return { canSubmit: bool, ref };
};

const usePutToCheckcodeModule: UsePutToCheckcodeModuleType = ({ blogId, body, className = "", isMd = 0, submitCallback }: UsePutToCheckcodeModuleProps) => {
  const open = useOverlayOpen();
  const htmlId = `#editor_content_html`;
  const submitRef = useRef<boolean>(false);
  const mdRef = useRef<number>(Number(isMd));
  const formRef = useRef<HTMLFormElement>(null);
  const { ref: textAreaRef, canSubmit } = useJudgeInputValue<HTMLTextAreaElement>(undefined, isMd);
  const request = useUserRequest({ method: "post", apiPath: apiName.putPrimaryMessage, data: { blogId }, cache: false });
  mdRef.current = Number(isMd);
  submitRef.current = canSubmit;
  const submit = useCallback<(e?: Event) => void>((e) => {
    e?.preventDefault();
    actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => {
      if (submitRef.current) {
        const requestCallback = () => {
          actionHandler<HTMLTextAreaElement, void, void>(textAreaRef?.current, (ele) => {
            ele.value = "";
          });
          submitCallback && submitCallback();
        };
        if (mdRef.current) {
          const preview = ele.querySelector(htmlId)?.textContent;
          open({
            head: "验证码",
            body: body({ request: request({ data: { ...formSerialize(ele), isMd: mdRef.current, preview } }), requestCallback, blogId }),
            height: 60,
            className,
          });
        } else {
          open({
            head: "验证码",
            body: body({ request: request({ data: { ...formSerialize(ele), isMd: mdRef.current } }), requestCallback, blogId }),
            height: 60,
            className,
          });
        }
      } else {
        log("can not submit", "warn");
      }
    });
  }, []);

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { formRef, textAreaRef, canSubmit };
};

const useCheckcodeModuleToSubmit: UseCheckcodeModuleToSubmitType = ({ blogId, request, closeHandler, requestCallback }: UseCheckcodeModuleToSubmitProps) => {
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const { bool, show, hide } = useBool();
  const formRef = useRef<HTMLFormElement>(null);
  const stateRef = useRef<{ loading: boolean; canSubmit: boolean }>({ loading: false, canSubmit: false });
  const { canSubmit, ref: inputRef } = useJudgeInputValue<HTMLInputElement>();
  stateRef.current.canSubmit = canSubmit;

  const flashData = useCallback(() => {
    const primaryRequest = createRequest({ apiPath: apiName.primaryMessage, query: { blogId } });
    primaryRequest.deleteCache();
    mutate(primaryRequest.cacheKey);
    requestCallback();
    setTimeout(closeHandler, 0);
  }, [blogId, closeHandler, requestCallback]);

  const submit = useCallback<(e?: Event) => void>(
    (e) => {
      e?.preventDefault();
      if (stateRef.current.loading) {
        return pushFail("加载中");
      } else if (!stateRef.current.canSubmit) {
        return pushFail("不能提交");
      } else {
        return actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(formRef.current, (ele) => {
          show();
          stateRef.current.loading = true;
          return request({ data: { ...formSerialize(ele), commentId: getRandom(1000).toString(16) } })
            .run<ApiRequestResult<string>>()
            .then(({ code, data }) => {
              if (code === 0) {
                flashData();
                return pushSucess("提交成功");
              } else {
                return pushFail(`提交失败: ${data.toString()}`);
              }
            })
            .catch((e) => pushFail(`发生错误: ${e.toString()}`))
            .finally(() => {
              stateRef.current.loading = false;
              hide();
            });
        });
      }
    },
    [request]
  );

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });
  return { formRef, inputRef, canSubmit, loading: bool };
};

const useMessageToReplayModule: UseMessageToModuleType = <T>({ body, className }: UseMessageToModuleProps<T>) => {
  const open = useOverlayOpen();
  return useCallback<(props: T) => void>((props) => open({ head: "回复", body: body({ props }), className }), [body]);
};

const useReplayModuleToSubmit: UseReplayModuleToSubmitType = <
  T extends PrimaryMessageProps | ChildMessageProps,
  F extends MyInputELement,
  O extends MyInputELement
>({
  props,
  request,
  isMd = 0,
  closeHandler,
}: UseReplayModuleToSubmitProps<T>) => {
  const mdRef = useRef<number>(isMd);
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const { bool, show, hide } = useBool();
  const formRef = useRef<HTMLFormElement>(null);
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");
  const stateRef = useRef<{ loading: boolean; canSubmit: boolean }>({ loading: false, canSubmit: false });
  const { ref: input1, canSubmit: canSubmit1 } = useJudgeInputValue<F>(undefined, isMd);
  const { ref: input2, canSubmit: canSubmit2 } = useJudgeInputValue<O>();

  mdRef.current = isMd;
  stateRef.current.canSubmit = canSubmit1 && canSubmit2;

  const flashData = useCallback(() => {
    const childMessageRequest = createRequest({
      apiPath: apiName.childMessage,
      query: { primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId },
    });
    childMessageRequest.deleteCache();
    mutate(childMessageRequest.cacheKey);
    setTimeout(closeHandler, 0);
  }, [isChild, closeHandler]);

  const submit = useCallback<(e?: Event) => void>(
    (e) => {
      e?.preventDefault();
      if (stateRef.current.loading) {
        return pushFail("加载中");
      } else if (!stateRef.current.canSubmit) {
        return pushFail("不能提交");
      } else {
        return actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(formRef.current, (ele) => {
          show();
          stateRef.current.loading = true;
          const requestPromise = mdRef.current
            ? request({
                data: {
                  ...formSerialize(ele),
                  preview: ele.querySelector("#editor_content_html")?.textContent,
                  blogId: props.blogId,
                  primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId,
                  toIp: props.fromIp,
                  toUserId: props.fromUserId,
                  commentId: getRandom(1000).toString(16),
                  isMd: mdRef.current,
                },
              })
            : request({
                data: {
                  ...formSerialize(ele),
                  blogId: props.blogId,
                  primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId,
                  toIp: props.fromIp,
                  toUserId: props.fromUserId,
                  commentId: getRandom(1000).toString(16),
                  isMd: mdRef.current,
                },
              });
          return requestPromise
            .run<ApiRequestResult<string>>()
            .then(({ code, data }) => {
              if (code === 0) {
                flashData();
                return pushSucess("提交成功");
              } else {
                return pushFail(`提交失败: ${data.toString()}`);
              }
            })
            .catch((e) => pushFail(`发生错误: ${e.toString()}`))
            .finally(() => {
              stateRef.current.loading = false;
              hide();
            });
        });
      }
    },
    [request, closeHandler, flashData]
  );

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { input1, input2, submit, canSubmit: canSubmit1 && canSubmit2, loading: bool, formRef };
};

const useMessageToDeleteModule: UseMessageToModuleType = <T>({ body, className }: UseMessageToModuleProps<T>) => {
  const open = useOverlayOpen();
  return useCallback<(props: T) => void>((props) => open({ head: "删除", body: body({ props }), className }), [body]);
};

const useDeleteModuleToSubmit: UseDeleteModuleToSubmitType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  request,
  closeHandler,
}: UseDeleteModuleToSubmitProps<T>) => {
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const { show, hide, bool } = useBool();
  const loadingRef = useRef<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

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
  }, [closeHandler, isChild]);

  const submit = useCallback<(e?: Event) => void>(
    (e) => {
      e?.preventDefault();
      if (loadingRef.current) {
        return pushFail("加载中");
      } else {
        return actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(formRef.current, () => {
          loadingRef.current = true;
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
                return pushSucess(`删除${isChild ? "子评论" : "主评论"}成功, commentId: ${props.commentId}`);
              } else {
                return pushFail(`删除${isChild ? "子评论" : "主评论"}失败, commentId: ${props.commentId}, message: ${data.toString()}`);
              }
            })
            .catch((e) => pushFail(`删除${isChild ? "子评论" : "主评论"}出错, commentId: ${props.commentId}, error: ${e.toString()}`))
            .finally(() => {
              loadingRef.current = false;
              hide();
            });
        });
      }
    },
    [request, isChild, props]
  );

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { formRef, loading: bool };
};

const useMessageToUpdateModule: UseMessageToModuleType = <T>({ body, className }: UseMessageToModuleProps<T>) => {
  const open = useOverlayOpen();
  return useCallback<(props: T) => void>((props) => open({ head: "更新", body: body({ props }), className }), [body]);
};

const useUpdateModuleToSubmit: UseUpdateModuleToSubmitType = <
  T extends PrimaryMessageProps | ChildMessageProps,
  F extends MyInputELement,
  O extends MyInputELement
>({
  props,
  request,
  closeHandler,
}: UseUpdateModuleToSubmitProps<T>) => {
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const { bool, show, hide } = useBool();
  const formRef = useRef<HTMLFormElement>(null);
  const { ref: input1, canSubmit: canSubmit1 } = useJudgeInputValue<F>();
  const { ref: input2, canSubmit: canSubmit2 } = useJudgeInputValue<O>();
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");
  const stateRef = useRef<{ loading: boolean; canSubmit: boolean }>({ loading: false, canSubmit: false });

  stateRef.current.canSubmit = canSubmit1 && canSubmit2;

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
  }, [isChild, closeHandler]);

  const submit = useCallback<(e?: Event) => void>((e) => {
    e?.preventDefault();
    if (stateRef.current.loading) {
      return pushFail("加载中");
    } else if (!stateRef.current.canSubmit) {
      return pushFail("不能提交");
    } else {
      if (input1 && input1.current && (input1.current.value === props.content || input1.current.value === "")) {
        return pushFail("输入的内容没有变化或者为空");
      }
      return actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(formRef.current, (ele) => {
        show();
        stateRef.current.loading = true;
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
              return pushSucess(`更新成功, old: ${props.content} --> new: ${input1?.current?.value}`);
            } else {
              return pushFail(`更新失败, ${data.toString()}`);
            }
          })
          .catch((e) => pushFail(`更新出错, ${e.toString()}`))
          .finally(() => {
            stateRef.current.loading = false;
            hide();
          });
      });
    }
  }, []);

  useAutoActionHandler<Event, void>({
    action: submit,
    addListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.addEventListener("submit", action));
    },
    removeListenerCallback: (action: (e: Event) => void) => {
      actionHandler<HTMLFormElement, void, void>(formRef.current, (ele) => ele.removeEventListener("submit", action));
    },
  });

  return { input1, input2, submit, canSubmit: canSubmit1 && canSubmit2, loading: bool, formRef };
};

export {
  useChildMessage,
  useJudgeInputValue,
  usePutToCheckcodeModule,
  useCheckcodeModuleToSubmit,
  useMessageToReplayModule,
  useReplayModuleToSubmit,
  useMessageToDeleteModule,
  useDeleteModuleToSubmit,
  useMessageToUpdateModule,
  useUpdateModuleToSubmit,
};
