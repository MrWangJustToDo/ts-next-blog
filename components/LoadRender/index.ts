import { useEffect, useMemo, useState } from "react";
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
import { AutoUpdateStateType, GetCurrentInitialDataType, LoadRenderProps, LoadRenderType, RenderProps, RenderType } from "types/components";

const useCurrentInitialData: GetCurrentInitialDataType = ({ initialData, apiPath, needinitialData }) => {
  const { state } = useCurrentState();

  if (initialData) return { currentInitialData: initialData };

  if (apiPath && needinitialData) return { currentInitialData: state.server[apiPath]["data"] };

  return { currentInitialData: null };
};

const useAutoUpdateState: AutoUpdateStateType = ({ needUpdate, initialData, apiPath, currentData }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (needUpdate && apiPath && !isEqual(initialData, currentData)) {
      log(`start update store from loadrender, apiPath: ${apiPath}`, "normal");
      dispatch(getDataSucess_Server({ name: apiPath, data: currentData }));
    }
  }, [needUpdate, apiPath, initialData, currentData]);
};

const Render: RenderType = <T>({
  currentPath,
  currentFetcher,
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
  const [loadingEle, setLoadingEle] = useState<JSX.Element | null>(null);

  const { data, error }: { data?: any; error?: any } = useSWR(currentPath, currentFetcher, {
    initialData: currentInitialData,
    revalidateOnMount,
    revalidateOnFocus,
  });

  useEffect(() => {
    delay(delayTime, () => setLoadingEle(loading({ _style: placeholder, className: "p-4" })), currentPath);
    return () => cancel(currentPath!);
  }, [delayTime, currentPath]);

  const currentData = data ? autoTransformData(data) : null;

  useAutoUpdateState<T>({ needUpdate, initialData: currentInitialData, apiPath, currentData });

  if (error) return loadError(error.toString());

  if (currentInitialData || currentData) {
    // make soure not flash if data loaded
    cancel(currentPath);

    return loaded(currentData ? currentData : currentInitialData);
  }

  return loadingEle;
};

const LoadRender: LoadRenderType = <T>({
  method,
  path,
  apiPath,
  query,
  cacheTime,
  fetcher,
  requestData,
  initialData,
  loaded,
  placeholder,
  token = false,
  delayTime = 260,
  loading = Loading,
  needUpdate = false,
  needinitialData = false,
  loadError = loadingError,
  revalidateOnMount = true,
  revalidateOnFocus = true,
}: LoadRenderProps<T>) => {
  if (!path && !apiPath) throw new Error("loadrender error, path undefined!");

  const currentPath = apiPath ? apiPath : path;

  const currentRequestData = autoStringify(requestData);

  const currentHeaderToken = token ? autoStringify({ apiToken: token }) : false;

  const defaultFetcher = useMemo(
    () => createRequest({ method, query: false, data: currentRequestData, header: currentHeaderToken, apiPath, cacheTime }),
    [apiPath, currentRequestData, currentHeaderToken, cacheTime]
  );

  const currentFetcher = fetcher ? fetcher : defaultFetcher.run;

  const { currentInitialData } = useCurrentInitialData({ initialData, apiPath, needinitialData });

  const currentRequestPath = query ? transformPath({ path, apiPath, query, needPre: false }) : currentPath!;

  return Render({
    loadError,
    loaded,
    loading,
    delayTime,
    apiPath,
    needUpdate,
    placeholder,
    revalidateOnFocus,
    revalidateOnMount,
    currentInitialData,
    currentFetcher,
    currentPath: currentRequestPath,
  });
};

export default LoadRender;
