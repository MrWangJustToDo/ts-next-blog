import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import isEqual from "lodash/isEqual";
import Loading from "components/Loading";
import loadingError from "./loadingError";
import { log } from "utils/log";
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
  const loadingEle = useLoading({ loading, placeholder, delayTime, cancelKey: currentRequest.cacheKey });

  // only need key
  const { data, error } = useSWR<T>(currentRequest.cacheKey, currentRequest.run, {
    initialData: currentInitialData,
    revalidateOnMount,
    revalidateOnFocus,
  });

  const currentData = data ? autoTransformData<T, any>(data) : null;

  useAutoUpdateState<T>({ needUpdate, initialData: currentInitialData, apiPath, currentData });

  if (error) return loadError(error.toString());

  if (currentInitialData || currentData) {
    // make soure not flash if data loaded
    cancel(currentRequest.cacheKey);

    return loaded(currentData ? currentData : currentInitialData, currentRequest);
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
    [apiPath, path, currentRequestData, currentHeader, cacheTime, currentQuery]
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
  });
};

export default LoadRender;
