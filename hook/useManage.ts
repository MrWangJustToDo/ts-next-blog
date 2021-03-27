import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import debounce from "lodash/debounce";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { manageLength } from "config/manage";
import { createRequest } from "utils/fetcher";
import { formSerialize } from "utils/data";
import { actionHandler, judgeAction, loadingAction } from "utils/action";
import { setDataSucess_client } from "store/reducer/client/action";
import { useCurrentState } from "./useBase";
import { useOverlayOpen } from "./useOverlay";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSucessToast } from "./useToast";
import { ApiRequestResult } from "types/utils";
import {
  BlogContentProps,
  UseAddRequestType,
  UseDeleteRequestType,
  UseJudgeInputType,
  UseManageToAddModuleType,
  UseManageToDeleteModuleType,
  UseResultType,
  UseSearchType,
} from "types/hook";

let useSearch: UseSearchType;

let useResult: UseResultType;

let useManageToAddModule: UseManageToAddModuleType;

let useAddRequest: UseAddRequestType;

let useJudgeInput: UseJudgeInputType;

let useManageToDeleteModule: UseManageToDeleteModuleType;

let useDeleteRequest: UseDeleteRequestType;

useSearch = ({ request }) => {
  const fail = useFailToast();
  const dispatch = useDispatch();
  const ref = useRef<HTMLFormElement>(null);
  const search = useCallback(
    () =>
      actionHandler<HTMLFormElement, Promise<void>, Promise<void>>(ref.current, (ele) => {
        return request({ data: formSerialize(ele) })
          .run<ApiRequestResult<BlogContentProps>>(apiName.search)
          .then(({ code, data }) => {
            if (code === 0) {
              if (Array.isArray(data)) {
                dispatch(setDataSucess_client({ name: actionName.currentResult, data }));
              }
            }
            return fail("搜索结果数据错误");
          })
          .catch((e) => fail(`搜索出错:${e.toString()}`));
      }),
    [request]
  );
  return [ref, search];
};

useResult = () => {
  const [page, setPage] = useState<number>(1);
  const { state } = useCurrentState();
  const result = <BlogContentProps[]>state.client[actionName.currentResult]["data"];
  const allPage = Math.ceil(result.length / manageLength);
  const increasePage = useCallback(() => setPage((last) => last + 1), []);
  const decreasePage = useCallback(() => setPage((last) => last - 1), []);
  const increaseAble = page < allPage;
  const decreaseAble = page > 1;
  const currentResult = result.slice(page - 1 * manageLength, page * manageLength);
  return { currentResult, page, increaseAble, increasePage, decreaseAble, decreasePage };
};

useManageToAddModule = ({ title, body, request, className, judgeApiName, requestApiName }) => {
  const open = useOverlayOpen();
  const click = useCallback(() => open({ head: title, body: body(request)(judgeApiName)(requestApiName), className }), [request, judgeApiName, requestApiName]);
  return click;
};

useAddRequest = ({ request, successCallback }) => {
  const ref = useRef<HTMLInputElement>(null);
  const fail = useFailToast();
  const success = useSucessToast();
  const doRequest = useCallback(
    () =>
      request({ data: { [ref.current!.name]: ref.current?.value } })
        .run<ApiRequestResult<string>>()
        .then(({ code, data }) => {
          if (code === 0) {
            successCallback();
            return success(`添加tag成功，${data.toString()}`);
          } else {
            return fail(`添加tag失败，请稍候尝试`);
          }
        })
        .catch((e) => fail(`添加tag出错，${e.toString()}`)),
    [request, successCallback]
  );
  return [ref, doRequest];
};

useJudgeInput = ({ option, forWardRef, judgeApiName, successClassName, failClassName, loadingClassName }) => {
  const ref = useRef<HTMLInputElement>(null);
  const currentRef = forWardRef !== undefined ? forWardRef : ref;
  const fail = useRef<{ current: string }>({ current: option.fail });
  const success = useRef<string>(option.success);
  // 输入验证成败
  const [bool, setBool] = useState<boolean>(false);
  // 验证中状态
  const [loading, setLoading] = useState<boolean>(false);
  const judge = useCallback(
    debounce(() => {
      // 多次尝试的状态分离
      const current = fail.current;
      judgeAction<HTMLInputElement>({
        element: currentRef.current!,
        judge: () => <Promise<boolean>>actionHandler<boolean, Promise<boolean>, Promise<boolean>>(
            option.regexp.test(currentRef.current!.value),
            () => <Promise<boolean>>actionHandler<apiName, Promise<boolean>, Promise<boolean>>(
                judgeApiName,
                (apiname) =>
                  createRequest({ apiPath: apiname, method: "post", data: { [currentRef.current!.name]: currentRef.current!.value } })
                    .run<ApiRequestResult<string>>()
                    .then(({ code, data }) => {
                      if (code === 0) {
                        return true;
                      } else {
                        current.current = data.toString();
                        return false;
                      }
                    })
                    .catch((e) => {
                      current.current = e.toString();
                      return false;
                    }),
                () => Promise.resolve(true)
              ),
            () => Promise.resolve(false)
          ),
        successMessage: success,
        successClassName,
        successCallback: () => {
          setBool(true);
          setLoading(false);
        },
        failMessage: fail,
        failClassName,
        failCallback: () => {
          setBool(false);
          setLoading(false);
        },
      });
    }, 800),
    [option, judgeApiName]
  );
  const start = useCallback(() => {
    if (!loading) {
      setLoading(true);
      // 重新开始状态
      fail.current = { current: option.fail };
      loadingAction({ element: currentRef.current!, loadingClassName });
    }
  }, [loading]);
  const addListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<HTMLInputElement, void, void>(currentRef.current, (ele) => ele.addEventListener("input", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: () => void) => void>(
    (action) => actionHandler<HTMLInputElement, void, void>(currentRef.current, (ele) => ele.removeEventListener("input", action)),
    []
  );
  useAutoActionHandler({ action: start, addListener: addListenerCallback, removeListener: removeListenerCallback });
  useAutoActionHandler({ action: judge, addListener: addListenerCallback, removeListener: removeListenerCallback });
  return [currentRef, bool];
};

useManageToDeleteModule = ({ title, body, request, item, successCallback }) => {
  const open = useOverlayOpen();
  const click = useCallback(() => open({ head: title, body: body(request)(item)(successCallback) }), [body, request, item, successCallback]);
  return click;
};

useDeleteRequest = ({ request, close, successCallback }) => {
  const fail = useFailToast();
  const success = useSucessToast();
  const doRequest = useCallback(
    () =>
      request
        .run<ApiRequestResult<string>>()
        .then(({ code, data }) => {
          if (code === 0) {
            if (successCallback) {
              successCallback();
            }
            close();
            return success("删除成功");
          } else {
            return fail(`删除失败${data}`);
          }
        })
        .catch((e) => fail(`删除出错：${e.toString()}`)),
    [request, close, successCallback]
  );
  return doRequest;
};

export { useSearch, useResult, useManageToAddModule, useAddRequest, useJudgeInput, useManageToDeleteModule, useDeleteRequest };
