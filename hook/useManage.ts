import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { createRequest } from "utils/fetcher";
import { formSerialize } from "utils/data";
import { actionHandler, judgeAction, loadingAction } from "utils/action";
import { setDataFail_client, setDataLoading_client, setDataSuccess_client } from "store/reducer/client/action";
import { useBool } from "./useData";
import { useCurrentState } from "./useBase";
import { useCurrentUser } from "./useUser";
import { useOverlayOpen } from "./useOverlay";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSuccessToast } from "./useToast";
import { ApiRequestResult } from "types/utils";
import {
  BlogContentProps,
  UseAddRequestType,
  UseDeleteRequestType,
  UseJudgeInputType,
  UseManageToAddModuleType,
  UseManageToDeleteModuleType,
  UseSearchType,
} from "types/hook";

const useSearch: UseSearchType = () => {
  const fail = useFailToast();
  const dispatch = useDispatch();
  const success = useSuccessToast();
  const { userId } = useCurrentUser();
  const ref = useRef<HTMLFormElement>(null);
  const search = useCallback(
    () =>
      actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(ref.current, (ele) => {
        if (userId !== undefined) {
          dispatch(setDataLoading_client({ name: actionName.currentResult }));
          return createRequest({ method: "post", header: { apiToken: true }, cache: false, data: { ...formSerialize(ele), userId }, apiPath: apiName.search })
            .run<ApiRequestResult<BlogContentProps>>()
            .then((res) => {
              if (res) {
                const { code, data } = res;
                if (code === 0) {
                  if (Array.isArray(data)) {
                    dispatch(setDataSuccess_client({ name: actionName.currentResult, data }));
                    return success(`搜索数据成功，一共${data.length}条数据`);
                  }
                }
              }
              return fail("搜索结果数据错误");
            })
            .catch((e) => {
              dispatch(setDataFail_client({ name: actionName.currentResult, error: e }));
              return fail(`搜索出错:${e.toString()}`);
            });
        } else {
          return fail(`当前未登录`);
        }
      }),
    [userId]
  );
  return [ref, search];
};

const useManageToAddModule: UseManageToAddModuleType = ({ title, body, className }) => {
  const open = useOverlayOpen();
  const click = useCallback(() => open({ head: title, body, className }), []);
  return click;
};

const useAddRequest: UseAddRequestType = ({ request, successCallback }) => {
  const fail = useFailToast();
  const success = useSuccessToast();
  const loadingRef = useRef<boolean>();
  const { bool, show, hide } = useBool();
  const ref = useRef<HTMLFormElement>(null);

  loadingRef.current = bool;

  useAutoActionHandler<Event, null>({
    actionCallback: (e?: Event) => {
      e?.preventDefault();
      if (loadingRef.current) {
        return fail("加载中，不能提交");
      } else {
        actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(
          ref.current,
          (ele) => {
            show();
            return request({ data: { ...formSerialize(ele) } })
              .run<ApiRequestResult<string>>()
              .then(({ code, data }) => {
                if (code === 0) {
                  successCallback();
                  return success(`添加tag成功，${data.toString()}`);
                } else {
                  return fail(`添加tag失败，请稍候尝试`);
                }
              })
              .catch((e) => fail(`添加tag出错，${e.toString()}`))
              .finally(hide);
          },
          () => fail(`当前组件已经卸载`)
        );
      }
    },
    addListenerCallback: (action) => actionHandler<HTMLFormElement, void, void>(ref.current, (ele) => ele.addEventListener("submit", action)),
    removeListenerCallback: (action) => actionHandler<HTMLFormElement, void, void>(ref.current, (ele) => ele.removeEventListener("submit", action)),
  });
  return [ref, bool];
};

const useJudgeInput: UseJudgeInputType = ({ option, forWardRef, judgeApiName, successClassName, failClassName, loadingClassName }) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleRef = useRef<{ needHandle: { state: boolean } }>({ needHandle: { state: true } });
  const [state, setState] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const currentRef = forWardRef !== undefined ? forWardRef : ref;
  const judge = useCallback(
    debounce(() => {
      // 分离状态
      const currentNeedHandle = handleRef.current;
      judgeAction<HTMLInputElement>({
        element: currentRef.current!,
        judge: () => <Promise<{ className: string; message: string; state: boolean }>>actionHandler<
            boolean,
            Promise<{ className: string; message: string; state: boolean }>,
            Promise<{ className: string; message: string; state: boolean }>
          >(
            option.regexp.test(currentRef.current!.value),
            () =>
              <Promise<{ className: string; message: string; state: boolean }>>(
                actionHandler<
                  apiName,
                  Promise<{ className: string; message: string; state: boolean }>,
                  Promise<{ className: string; message: string; state: boolean }>
                >(
                  judgeApiName,
                  (apiName) =>
                    createRequest({ apiPath: apiName, method: "post", data: { [currentRef.current!.name]: currentRef.current!.value }, cache: false })
                      .run<ApiRequestResult<string>>()
                      .then(({ code, data }) => {
                        if (code === 0) {
                          return { className: successClassName, message: option.success, state: true };
                        } else {
                          return { className: failClassName, message: data.toString(), state: false };
                        }
                      })
                      .catch((e) => {
                        return { className: failClassName, message: e.toString(), state: false };
                      }),
                  () => Promise.resolve({ className: successClassName, message: option.success, state: true })
                )
              ),
            () => Promise.resolve({ className: failClassName, message: option.fail, state: false })
          ).then((data) => {
            if (data && currentNeedHandle.needHandle) {
              const { state } = data;
              if (state) {
                setState(true);
              } else {
                setState(false);
              }
              setLoading(false);
            }
            return data;
          }),
      });
    }, 800),
    [option, judgeApiName]
  );
  const start = useCallback(() => {
    setLoading((last) => {
      if (last) {
        return last;
      } else {
        loadingAction({ element: currentRef.current!, loadingClassName });
        return true;
      }
    });
    // 取消上一个状态
    handleRef.current.needHandle.state = false;
    // 重新开始状态
    handleRef.current = { needHandle: { state: true } };
  }, []);
  const addListenerCallback = (action: () => void) =>
    actionHandler<HTMLInputElement, void, void>(currentRef.current, (ele) => ele.addEventListener("input", action));
  const removeListenerCallback = (action: () => void) =>
    actionHandler<HTMLInputElement, void, void>(currentRef.current, (ele) => ele.removeEventListener("input", action));
  useAutoActionHandler({ action: start, addListenerCallback: addListenerCallback, removeListenerCallback: removeListenerCallback });
  useAutoActionHandler({ action: judge, addListenerCallback: addListenerCallback, removeListenerCallback: removeListenerCallback });
  return [currentRef, state, loading];
};

const useManageToDeleteModule: UseManageToDeleteModuleType = ({ title, body, deleteItem }) => {
  const open = useOverlayOpen();
  const click = useCallback(() => open({ head: title, body: body({ deleteItem }) }), [title, body]);
  return click;
};

const useDeleteRequest: UseDeleteRequestType = ({ request, closeHandler, successHandler }) => {
  const fail = useFailToast();
  const success = useSuccessToast();
  const doRequest = useCallback(
    () =>
      request
        .run<ApiRequestResult<string>>()
        .then(({ code, data }) => {
          if (code === 0) {
            successHandler();
            closeHandler();
            return success("删除成功");
          } else {
            return fail(`删除失败${data}`);
          }
        })
        .catch((e) => fail(`删除出错：${e.toString()}`)),
    [request, closeHandler, successHandler]
  );
  return doRequest;
};

const useFilterResult = ({ currentBlogId }: { currentBlogId: string }) => {
  // 获取当前result
  const { state: result, dispatch } = useCurrentState<BlogContentProps[]>((state) => state.client[actionName.currentResult]["data"]);
  return useCallback(
    () =>
      dispatch(
        setDataSuccess_client({ name: actionName.currentResult, data: (result as BlogContentProps[]).filter(({ blogId }) => blogId !== currentBlogId) })
      ),
    [currentBlogId]
  );
};

export { useSearch, useManageToAddModule, useAddRequest, useJudgeInput, useManageToDeleteModule, useDeleteRequest, useFilterResult };
