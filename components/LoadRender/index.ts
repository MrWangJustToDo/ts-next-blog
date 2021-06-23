import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import isEqual from "lodash/isEqual";
import Loading from "components/Loading";
import loadingError from "./loadingError";
import { log } from "utils/log";
import { transformPath } from "utils/path";
import { cancel, delay } from "utils/delay";
import { autoTransformData } from "utils/data";
import { autoStringify, createRequest } from "utils/fetcher";
import { useCurrentState } from "hook/useBase";
import { getDataSucess_Server } from "store/reducer/server/action";
import { AutoUpdateStateType, GetCurrentInitialDataType, LoadRenderProps, LoadRenderType, RenderProps, RenderType, UseLoadingType } from "types/components";

const useCurrentInitialData: GetCurrentInitialDataType = ({ initialData, apiPath, needinitialData }) => {
  const { state } = useCurrentState();

  if (initialData) return { currentInitialData: initialData };

  if (apiPath && needinitialData) return { currentInitialData: state.server[apiPath]["data"] };

  return { currentInitialData: null };
};

const useAutoUpdateState: AutoUpdateStateType = ({ needUpdate, initialData, apiPath, currentData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (needUpdate && apiPath && currentData && !isEqual(initialData, currentData)) {
      log(`start update store from loadrender, apiPath: ${apiPath}`, "normal");
      dispatch(getDataSucess_Server({ name: apiPath, data: currentData }));
    }
  }, [needUpdate, apiPath, initialData, currentData]);
};

const useLoading: UseLoadingType = ({ loading, placeholder, delayTime, currentRequestPath }) => {
  const [loadingEle, setLoadingEle] = useState<JSX.Element | null>(null);

  useEffect(() => {
    delay(delayTime, () => setLoadingEle(loading({ _style: placeholder, className: "p-4" })), currentRequestPath);
    return () => cancel(currentRequestPath);
  }, [delayTime, currentRequestPath]);

  return loadingEle;
};

const Render: RenderType = <T>({
  currentRequest,
  currentRequestPath,
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
  const loadingEle = useLoading({ loading, placeholder, delayTime, currentRequestPath });

  const { data, error }: { data?: any; error?: any } = useSWR(currentRequestPath, currentRequest.run, {
    initialData: currentInitialData,
    revalidateOnMount,
    revalidateOnFocus,
  });

  const currentData = data ? autoTransformData<T, any>(data) : null;

  useAutoUpdateState<T>({ needUpdate, initialData: currentInitialData, apiPath, currentData });

  const currentDeleteCache = useCallback(() => currentRequest.cache.deleteRightNow(currentRequestPath), [currentRequest, currentRequestPath]);

  if (error) return loadError(error.toString());

  if (currentInitialData || currentData) {
    // make soure not flash if data loaded
    cancel(currentRequestPath);

    return loaded(currentData ? currentData : currentInitialData, currentRequestPath, currentDeleteCache, currentRequest);
  }

  return loadingEle;
};

const LoadRender: LoadRenderType = <T>({
  path,
  query,
  method,
  apiPath,
  cacheTime,
  requestData,
  initialData,
  loaded,
  loading = Loading,
  loadError = loadingError,
  placeholder,
  token = false,
  delayTime = 260,
  needUpdate = false,
  needinitialData = false,
  revalidateOnMount = true,
  revalidateOnFocus = true,
}: LoadRenderProps<T>) => {
  if (!path && !apiPath) throw new Error("loadrender error, path undefined!");

  const currentPath = apiPath ? apiPath : path;

  const currentRequestData = autoStringify(requestData);

  const currentHeaderToken = token ? autoStringify({ apiToken: token }) : false;

  const currentRequestPath = query ? transformPath({ path, apiPath, query, needPre: false }) : currentPath!;

  const currentRequest = useMemo(
    () => createRequest({ method, query: false, data: currentRequestData, header: currentHeaderToken, apiPath, cacheTime, cacheKey: currentRequestPath }),
    [apiPath, currentRequestData, currentHeaderToken, currentRequestPath, cacheTime]
  );

  const { currentInitialData } = useCurrentInitialData({ initialData, apiPath, needinitialData });

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
    currentInitialData,
    currentRequestPath,
  });
};

export default LoadRender;
