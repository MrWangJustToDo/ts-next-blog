import { useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { delay } from "utils/delay";
import { formSerialize } from "utils/data";
import { actionHandler } from "utils/action";
import { autoAssignParams, autoStringify, createRequest } from "utils/fetcher";
import { setDataFail_client, setDataSucess_client } from "store/reducer/client/action";
import { useCurrentState } from "./useBase";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSucessToast } from "./useToast";
import { ApiRequestResult } from "types/utils";
import { UserProps, UseAutoLoginType, UseCurrentUserType, UseLoginType, UseLogoutType, UseUserRequest } from "types/hook";

// 自动登录
const useAutoLogin: UseAutoLoginType = () => {
  const { dispatch, state } = useCurrentState();
  const user = state.client[actionName.currentUser]["data"];
  const loginRequest = useMemo(() => createRequest({ header: { apiToken: true }, apiPath: apiName.autoLogin, cache: false }), []);
  const autoLoginCallback = useCallback(
    () =>
      loginRequest
        .run<ApiRequestResult<UserProps>>()
        .then(({ code, data }) => {
          if (code === 0 && !Array.isArray(data) && data.userId) {
            dispatch(setDataSucess_client({ name: actionName.currentUser, data }));
          } else {
            dispatch(setDataFail_client({ name: actionName.currentUser, data: {} }));
          }
        })
        .catch(() => dispatch(setDataFail_client({ name: actionName.currentUser, data: {} }))),
    []
  );
  useAutoActionHandler({
    timmer: Boolean(user.userId),
    once: false,
    rightNow: true,
    delayTime: 1000 * 60 * 10,
    action: autoLoginCallback,
    // actionState: Boolean(user.userId),
  });
};

// 获取当前登录对象
const useCurrentUser: UseCurrentUserType = () => {
  const { state } = useCurrentState();
  return state.client[actionName.currentUser]["data"];
};

// 登录
const useLogin: UseLoginType = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const failToast = useFailToast();
  const successToast = useSucessToast();
  const ref = useRef<HTMLFormElement>(null);
  const loginCallback = useCallback<(e?: Event) => void>((e) => {
    e?.preventDefault();
    createRequest({ method: "post", data: formSerialize(ref.current!), cache: false, apiPath: apiName.login })
      .run<ApiRequestResult<UserProps>>()
      .then(({ code, data }) => {
        if (code === 0 && !Array.isArray(data) && data.userId) {
          dispatch(setDataSucess_client({ name: actionName.currentUser, data }));
          successToast("登录成功，将要跳转到首页");
          delay(1000, () => router.push("/"));
        } else {
          failToast(`登录失败：${data}`);
        }
      })
      .catch((e) => failToast(`出现错误：${e.toString()}`));
  }, []);
  const addListenerCallback = useCallback<(action: (e?: Event) => void) => void>(
    (action) => actionHandler<HTMLFormElement, void, void>(ref.current, (ele) => ele.addEventListener("submit", action)),
    []
  );
  const removeListenerCallback = useCallback<(action: (e?: Event) => void) => void>(
    (action) => actionHandler<HTMLFormElement, void, void>(ref.current, (ele) => ele.removeEventListener("submit", action)),
    []
  );
  useAutoActionHandler<Event, void>({ action: loginCallback, addListener: addListenerCallback, removeListener: removeListenerCallback });
  return ref;
};

// 登出
const useLogout: UseLogoutType = () => {
  const router = useRouter();
  const failToast = useFailToast();
  const successToast = useSucessToast();
  const logoutRequest = useMemo(() => createRequest({ header: { apiToken: true }, cache: false, apiPath: apiName.logout }), []);
  const { state, dispatch } = useCurrentState();
  const user = state.client[actionName.currentUser]["data"] as UserProps;
  const logoutCallback = useCallback(() => {
    if (user.userId) {
      return delay<void>(100, () =>
        logoutRequest
          .run<ApiRequestResult<string>>()
          .then(({ code, state }) => {
            if (code === 0) {
              dispatch(setDataSucess_client({ name: actionName.currentUser, data: {} }));
              successToast("登出成功，即将返回首页");
              delay(600, () => router.push("/"));
            } else {
              failToast(`登出失败：${state}`);
            }
          })
          .catch((e) => failToast(`出现错误：${e.toString()}`))
      );
    } else {
      return failToast(`当前未登录`);
    }
  }, [user]);
  return logoutCallback;
};

// 自动绑定当前用户的request
const useUserRequest: UseUserRequest = (props = {}) => {
  const { method, data, path, apiPath, header, cache } = props;
  const stringdata = autoStringify(data);
  const stringHeader = autoStringify(header);
  const user = useCurrentUser();
  return useMemo(
    () =>
      createRequest({
        method,
        data: autoAssignParams(stringdata, { userId: user.userId! }),
        path,
        cache,
        apiPath,
        header: stringHeader,
        query: { userId: user.userId! },
      }),
    [user.userId, stringdata, path, apiPath, stringHeader, method, cache]
  );
};

export { useAutoLogin, useCurrentUser, useLogin, useLogout, useUserRequest };
