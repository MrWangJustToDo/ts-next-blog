import { RefObject, useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/dist/client/router";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { delay } from "utils/delay";
import { formSerialize } from "utils/data";
import { actionHandler } from "utils/action";
import { autoAssignParams, autoStringify, createRequest } from "utils/fetcher";
import { useCurrentState } from "./useBase";
import { useAutoActionHandler } from "./useAuto";
import { useFailToast, useSuccessToast } from "./useToast";
import { setDataFail_client, setDataSuccess_client } from "store/reducer/client/share/action";
import type { IpAddressProps, UserProps } from "types";
import type { ApiRequestResult, AutoRequestProps, AutoRequestType } from "types/utils";

interface UseAutoLoginType {
  (): void;
}
interface UseCurrentUserType {
  (): UserProps;
}
interface UseLoginType {
  (): RefObject<HTMLFormElement>;
}
interface UseLogoutType {
  (): () => Promise<void>;
}
interface UseUserRequest {
  (props?: AutoRequestProps): AutoRequestType;
}

// 自动登录
export const useAutoLogin: UseAutoLoginType = () => {
  const { dispatch, state } = useCurrentState((state) => state.client[actionName.currentUser]["data"]);
  const { userId } = state as UserProps;
  const loginRequest = useMemo(() => createRequest({ header: { apiToken: true }, apiPath: apiName.autoLogin, cache: false }), []);
  const autoLoginCallback = useCallback(
    () =>
      loginRequest
        .run<ApiRequestResult<UserProps>>()
        .then(({ code, data }) => {
          if (code === 0 && !Array.isArray(data) && data.userId) {
            dispatch(setDataSuccess_client({ name: actionName.currentUser, data }));
          } else {
            dispatch(setDataFail_client({ name: actionName.currentUser, data: {} }));
          }
        })
        .catch(() => dispatch(setDataFail_client({ name: actionName.currentUser, data: {} }))),
    [dispatch, loginRequest]
  );
  useAutoActionHandler({
    timer: Boolean(userId),
    once: false,
    rightNow: Boolean(userId) ? false : true,
    delayTime: 1000 * 60 * 10,
    action: autoLoginCallback,
  });
};

export const useAutoGetIp = () => {
  const { dispatch, state } = useCurrentState((state) => state.client[actionName.currentUser]["data"]);
  const { country } = state as IpAddressProps;
  const getIp = useMemo(
    () =>
      createRequest({
        apiPath: apiName.thirdPath,
        method: "GET",
        cache: false,
        query: {
          path: process.env.NEXT_PUBLIC_IP_ADDRESS,
        },
      }),
    []
  );
  const autoGetIpCallback = useCallback(
    () =>
      getIp
        .run<ApiRequestResult<IpAddressProps>>()
        .then(({ code, data }) => {
          if (code === 0) {
            dispatch(setDataSuccess_client({ name: actionName.currentIp, data }));
          } else {
            dispatch(setDataFail_client({ name: actionName.currentIp, data: {} }));
          }
        })
        .catch(() => {}),
    [dispatch, getIp]
  );
  useAutoActionHandler({
    rightNow: !country,
    action: autoGetIpCallback,
  });
};

// 获取当前登录对象
export const useCurrentUser: UseCurrentUserType = () => {
  const { state } = useCurrentState((state) => state.client[actionName.currentUser]["data"]);
  return state as ReturnType<UseCurrentUserType>;
};

// 登录
export const useLogin: UseLoginType = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const failToast = useFailToast();
  const successToast = useSuccessToast();
  const ref = useRef<HTMLFormElement>(null);
  useAutoActionHandler<Event, void>({
    actionCallback: (e) => {
      e?.preventDefault();
      actionHandler<HTMLFormElement, Promise<void>>(ref.current, (ele) => {
        return createRequest({ method: "post", data: formSerialize(ele), cache: false, apiPath: apiName.login, encode: true })
          .run<ApiRequestResult<UserProps>>()
          .then(({ code, data }) => {
            if (code === 0 && !Array.isArray(data) && data.userId) {
              dispatch(setDataSuccess_client({ name: actionName.currentUser, data }));
              successToast("登录成功，将要跳转到首页");
              delay(1000, () => router.push("/"));
            } else {
              failToast(`登录失败：${data}`);
            }
          })
          .catch((e) => {
            failToast(`出现错误：${e.toString()}`);
          });
      });
    },
    addListenerCallback: (action) => actionHandler<HTMLFormElement, void>(ref.current, (ele) => ele.addEventListener("submit", action)),
    removeListenerCallback: (action) => actionHandler<HTMLFormElement, void>(ref.current, (ele) => ele.removeEventListener("submit", action)),
  });
  return ref;
};

// 登出
export const useLogout: UseLogoutType = () => {
  const router = useRouter();
  const user = useCurrentUser();
  const dispatch = useDispatch();
  const failToast = useFailToast();
  const successToast = useSuccessToast();
  const logoutRequest = useMemo(() => createRequest({ header: { apiToken: true }, cache: false, apiPath: apiName.logout }), []);
  const logoutCallback = useCallback(() => {
    if (user.userId) {
      return delay<void>(100, () =>
        logoutRequest
          .run<ApiRequestResult<string>>()
          .then(({ code, state }) => {
            if (code === 0) {
              dispatch(setDataSuccess_client({ name: actionName.currentUser, data: {} }));
              successToast("登出成功，即将返回首页");
              return delay(400, () => router.push("/"));
            } else {
              failToast(`登出失败：${state}`);
            }
          })
          .catch((e) => {
            failToast(`出现错误：${e.toString()}`);
          })
      );
    } else {
      return delay(10, () => {
        failToast(`当前未登录`);
      });
    }
  }, [dispatch, failToast, logoutRequest, router, successToast, user.userId]);
  return logoutCallback;
};

// 自动绑定当前用户的request
export const useUserRequest: UseUserRequest = (props = {}) => {
  const { method, data, path, apiPath, header, cache = false, cacheTime, encode, query } = props;
  const stringData = autoStringify(data);
  const stringHeader = autoStringify(header);
  const stringQuery = autoStringify(query);
  const user = useCurrentUser();
  return useMemo(
    () =>
      createRequest({
        method,
        data: autoAssignParams(stringData, { userId: user.userId! }),
        path,
        cache,
        apiPath,
        header: stringHeader,
        query: autoAssignParams(stringQuery, { userId: user.userId! }),
        cacheTime,
        encode,
      }),
    [method, stringData, user.userId, path, cache, apiPath, stringHeader, stringQuery, cacheTime, encode]
  );
};
