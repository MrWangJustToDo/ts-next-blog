import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import isEqual from "lodash/isEqual";
import { Loading } from "components/Loading";
import { LoadingError } from "./loadingError";
import { log } from "utils/log";
import { cancel, delay } from "utils/delay";
import { autoTransformData } from "utils/data";
import { autoStringify, createRequest } from "utils/fetcher";
import { useUpdateProps } from "hook/useBase";
import { useCurrentState } from "hook/useBase";
import {
  AutoUpdateStateType,
  GetCurrentInitialDataProps,
  GetCurrentInitialDataType,
  LoadRenderProps,
  LoadRenderType,
  RenderProps,
  RenderType,
  UseLoadingType,
} from "types/components";
import { getDataSuccess_Server } from "store/reducer/server/share/action";
import { ServerReducerKey } from "store/reducer/server/type";

const useCurrentInitialData: GetCurrentInitialDataType = <T = any>({ initialData, apiPath, needInitialData }: GetCurrentInitialDataProps<T>) => {
  const { state } = useCurrentState();

  if (initialData) return { currentInitialData: initialData };

  if (apiPath && needInitialData) return { currentInitialData: state.server[apiPath as ServerReducerKey]["data"] };

  return { currentInitialData: null };
};

const useAutoUpdateState: AutoUpdateStateType = ({ needUpdate, initialData, apiPath, currentData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (needUpdate && apiPath && currentData && !isEqual(initialData, currentData)) {
      log(`start update store from loadRender, apiPath: ${apiPath}`, "normal");
      dispatch(getDataSuccess_Server({ name: apiPath as ServerReducerKey, data: currentData }));
    }
  }, [needUpdate, apiPath, initialData, currentData]);
};

const useLoading: UseLoadingType = ({ loading, placeholder, delayTime, cancelKey }) => {
  const [loadingEle, setLoadingEle] = useState<JSX.Element | null>(null);

  useEffect(() => {
    delay(delayTime, () => setLoadingEle(loading({ _style: placeholder, className: "p-4" })), cancelKey);
    return () => cancel(cancelKey);
  }, [delayTime, cancelKey]);

  return loadingEle;
};

const Render: RenderType = <T>({
  currentRequest,
  currentInitialData,
  loading,
  loaded,
  loadError,
  delayTime,
  revalidateOnMount,
  revalidateOnFocus,
  placeholder,
  needUpdate,
  apiPath,
}: RenderProps<T>) => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useUpdateProps("Render", {
      currentRequest,
      currentInitialData,
      loading,
      loadError,
      delayTime,
      revalidateOnMount,
      revalidateOnFocus,
      placeholder,
      needUpdate,
      apiPath,
    });
  }

  const cancelKey = currentRequest.cacheKey + "-LoadRender";
  const loadingEle = useLoading({ loading, placeholder, delayTime, cancelKey });

  // only need key
  const { data, error } = useSWR<T>(currentRequest.cacheKey, currentRequest.run, {
    fallbackData: currentInitialData,
    revalidateOnMount,
    revalidateOnFocus,
  });

  const currentData = data ? autoTransformData<T, any>(data) : null;

  useAutoUpdateState<T>({ needUpdate, initialData: currentInitialData, apiPath, currentData });

  if (error) return loadError((error as Error).toString());

  if (currentInitialData) {
    if (Array.isArray(currentInitialData) && currentInitialData.length > 0) {
      cancel(cancelKey);
      return loaded(currentInitialData, currentRequest);
    }
    if (typeof currentInitialData && Object.keys(currentInitialData).length) {
      cancel(cancelKey);
      return loaded(currentInitialData, currentRequest);
    }
  }

  if (currentData && currentData !== currentInitialData) {
    // make page not flash if data loaded
    cancel(cancelKey);

    return loaded(currentData, currentRequest);
  }

  return loadingEle;
};

export const LoadRender: LoadRenderType = <T>({
  path,
  query,
  method,
  apiPath,
  cacheTime,
  requestData,
  initialData,
  loaded,
  loading = Loading,
  loadError = LoadingError,
  placeholder,
  token = false,
  delayTime = 260,
  needUpdate = false,
  needInitialData = false,
  revalidateOnMount = true,
  revalidateOnFocus = false,
}: LoadRenderProps<T>) => {
  if (!path && !apiPath) throw new Error("loadRender error, path undefined!");

  const currentRequestData = autoStringify(requestData);

  const currentHeader = autoStringify({ apiToken: token });

  const currentQuery = autoStringify(query);

  const currentRequest = useMemo(
    () =>
      createRequest({
        path,
        method,
        apiPath,
        cacheTime,
        query: currentQuery,
        data: currentRequestData,
        header: currentHeader,
      }),
    [path, method, apiPath, cacheTime, currentQuery, currentRequestData, currentHeader]
  );

  const { currentInitialData } = useCurrentInitialData({ initialData, apiPath, needInitialData });
  
  const ref = useRef(currentInitialData);

  return Render<T>({
    loadError,
    loaded,
    loading,
    delayTime,
    apiPath,
    needUpdate,
    placeholder,
    revalidateOnFocus,
    revalidateOnMount,
    currentRequest,
    currentInitialData: ref.current,
  });
};
