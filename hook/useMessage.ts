import { RefObject, useCallback, useMemo, useRef, useState } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { childMessageLength } from "config/message";
import { getRandom } from "utils/data";
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

const useChildMessage: UseChildMessageType = (props) => {
  const [page, setPage] = useState<number>(1);
  const [messageProps, setMessageProps] = useState<ChildMessageProps[]>([]);
  const more = page * childMessageLength < props.length;
  useMemo(() => setMessageProps(props.slice(0, page * childMessageLength)), [page, props]);
  const loadMore = useCallback(() => setPage((last) => last + 1), []);
  return { messageProps, more, loadMore };
};

const useJudgeInputValue: UseJudgeInputValueType = <T extends MyInputELement>(ref: RefObject<T>) => {
  const [bool, setBool] = useState<boolean>(false);
  const judgeValue = useCallback<() => void>(
    () => actionHandler<T, void, void>(ref.current, (ele) => (!!ele.value.length ? setBool(true) : setBool(false))),
    []
  );
  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.addEventListener("input", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<T, void, void>(ref.current, (ele) => ele.removeEventListener("input", action)),
    []
  );
  useAutoActionHandler({
    action: judgeValue,
    addListener: addListenerCallback,
    removeListener: removeListenerCallback,
  });
  return bool;
};

const usePutToCheckcodeModule: UsePutToCheckcodeModuleType = <T extends MyInputELement>({ blogId, body, className = "" }: UsePutToCheckcodeModuleProps) => {
  const ref = useRef<T>(null);
  const open = useOverlayOpen();
  const request = useUserRequest({ method: "post", apiPath: apiName.putPrimaryMessage, data: { blogId }, cache: false });
  const submit = useCallback(() => {
    actionHandler<T, void, void>(ref.current, (ele) => {
      if (!!ele.value.length) {
        open({
          head: "验证码",
          body: body({ request: request({ data: { content: ele.value } }), ref, blogId }),
          height: 60,
          className,
        });
      }
    });
  }, [body, request]);
  const canSubmit = useJudgeInputValue<T>(ref);
  return { ref, submit, canSubmit };
};

const useCheckcodeModuleToSubmit: UseCheckcodeModuleToSubmitType = <T extends MyInputELement>({
  blogId,
  request,
  messageRef,
  closeHandler,
}: UseCheckcodeModuleToSubmitProps) => {
  const ref = useRef<T>(null);
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const loadingRef = useRef<boolean>(false);
  const flashData = useCallback(() => {
    const primaryRequest = createRequest({ apiPath: apiName.primaryMessage, query: { blogId } });
    primaryRequest.deleteCache();
    mutate(primaryRequest.cacheKey);
    setTimeout(closeHandler, 0);
  }, [blogId, closeHandler]);
  const submit = useCallback(() => {
    if (loadingRef.current) {
      return pushFail("加载中");
    } else {
      return actionHandler<T, Promise<void>, Promise<void>>(ref.current, (ele) => {
        if (ele.value.length) {
          loadingRef.current = true;
          return request({ data: { checkCode: ele.value, commentId: getRandom(1000).toString(16) } })
            .run<ApiRequestResult<string>>()
            .then(({ code, data }) => {
              if (code === 0) {
                flashData();
                if (messageRef.current) {
                  messageRef.current.value = "";
                }
                return pushSucess("提交成功");
              } else {
                return pushFail(`提交失败: ${data.toString()}`);
              }
            })
            .catch((e) => pushFail(`发生错误: ${e.toString()}`))
            .finally(() => (loadingRef.current = false));
        } else {
          return pushFail(`输入框没有内容？`);
        }
      });
    }
  }, [request]);
  const canSubmit = useJudgeInputValue<T>(ref);
  return { ref, submit, canSubmit };
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
  closeHandler,
}: UseReplayModuleToSubmitProps<T>) => {
  const input1 = useRef<F>(null);
  const input2 = useRef<O>(null);
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const loadingRef = useRef<boolean>(false);
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");
  const flashData = useCallback(() => {
    const childMessageRequest = createRequest({
      apiPath: apiName.childMessage,
      query: { primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId },
    });
    childMessageRequest.deleteCache();
    mutate(childMessageRequest.cacheKey);
    setTimeout(closeHandler, 0);
  }, [isChild, closeHandler]);
  const submit = useCallback(() => {
    if (loadingRef.current) {
      return pushFail("加载中");
    } else {
      loadingRef.current = true;
      return request({
        data: {
          content: input1.current!.value,
          checkCode: input2.current!.value,
          blogId: props.blogId,
          primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : props.commentId,
          toIp: props.fromIp,
          toUserId: props.fromUserId,
          commentId: getRandom(1000).toString(16),
        },
      })
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
        .finally(() => (loadingRef.current = false));
    }
  }, [request, closeHandler, flashData]);
  const canSubmit1 = useJudgeInputValue(input1);
  const canSubmit2 = useJudgeInputValue(input2);
  return { input1, input2, submit, canSubmit: canSubmit1 && canSubmit2 };
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
  const isChild = Object.prototype.hasOwnProperty.call(props, "primaryCommentId");
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const loadingRef = useRef<boolean>(false);
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

  const submit = useCallback(() => {
    if (loadingRef.current) {
      return pushFail("加载中");
    } else {
      loadingRef.current = true;
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
        .finally(() => (loadingRef.current = false));
    }
  }, [request, isChild, props]);

  return submit;
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
  const input1 = useRef<F>(null);
  const input2 = useRef<O>(null);
  const pushFail = useFailToast();
  const pushSucess = useSucessToast();
  const loadingRef = useRef<boolean>(false);
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
  }, [isChild, closeHandler]);

  const submit = useCallback(() => {
    if (loadingRef.current) {
      return pushFail("加载中");
    } else {
      if (input1.current && (input1.current.value === props.content || input1.current.value === "")) {
        return pushFail("输入的内容没有变化或者为空");
      }
      const newContent = input1.current?.value;
      loadingRef.current = true;
      return request({
        data: {
          isChild,
          newContent,
          checkCode: input2.current!.value,
          blogId: props.blogId,
          commentId: props.commentId,
          primaryCommentId: isChild ? (props as ChildMessageProps).primaryCommentId : "",
        },
      })
        .run<ApiRequestResult<string>>()
        .then(({ code, data }) => {
          if (code === 0) {
            flashData();
            return pushSucess(`更新成功, old: ${props.content} --> new: ${newContent}`);
          } else {
            return pushFail(`更新失败, ${data.toString()}`);
          }
        })
        .catch((e) => pushFail(`更新出错, ${e.toString()}`))
        .finally(() => (loadingRef.current = false));
    }
  }, []);

  const canSubmit1 = useJudgeInputValue(input1);
  const canSubmit2 = useJudgeInputValue(input2);

  return { input1, input2, submit, canSubmit: canSubmit1 && canSubmit2 };
};

export {
  useChildMessage,
  usePutToCheckcodeModule,
  useCheckcodeModuleToSubmit,
  useMessageToReplayModule,
  useReplayModuleToSubmit,
  useMessageToDeleteModule,
  useDeleteModuleToSubmit,
  useMessageToUpdateModule,
  useUpdateModuleToSubmit,
};
