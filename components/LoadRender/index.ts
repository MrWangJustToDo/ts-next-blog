import { useEffect, useMemo, useState } from "react";
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
import { AutoUpdateStateType, GetCurrentInitialDataType, LoadRenderProps, LoadRenderType } from "types/components";

const getCurrentInitialData: GetCurrentInitialDataType = ({ initialData, apiPath, needinitialData }) => {
  const { state, dispatch } = useCurrentState();

  if (initialData) return { initialData, dispatch };

  if (apiPath && needinitialData) return { initialData: state.server[apiPath]["data"], dispatch };

  return { dispatch };
};

const autoUpdateState: AutoUpdateStateType = ({ needUpdate, initialData, apiPath, currentData, dispatch }) => {
  useEffect(() => {
    if (needUpdate && apiPath && !isEqual(initialData, currentData)) {
      log(`start update store from loadrender, apiPath: ${apiPath}`, "normal");
      dispatch(getDataSucess_Server({ name: apiPath, data: currentData }));
    }
  }, [needUpdate, apiPath, initialData, currentData]);
};

const LoadRender: LoadRenderType = <T>({
  method,
  path,
  apiPath,
  query,
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

  const [loadingEle, setLoadingEle] = useState<JSX.Element | null>(null);

  const currentPath = apiPath ? apiPath : path;

  const currentQuery = autoStringify(query);

  const currentRequestData = autoStringify(requestData);

  const currentHeaderToken = token ? JSON.stringify({ apiToken: token }) : false;

  useEffect(() => {
    delay(delayTime, () => setLoadingEle(loading({ _style: placeholder, className: "p-4" })), currentPath);
    return () => cancel(currentPath!);
  }, [method, currentQuery, currentRequestData, delayTime, currentPath]);

  const defaultFetcher = useMemo(
    () => createRequest({ method, query: false, data: currentRequestData, header: currentHeaderToken, apiPath }),
    [apiPath, currentRequestData, currentHeaderToken]
  );

  const currentFetcher = fetcher ? fetcher : defaultFetcher.run;

  const { initialData: currentInitialData, dispatch } = getCurrentInitialData({ initialData, apiPath, needinitialData });

  const currentRequestKey = query ? transformPath({ path, apiPath, query, needPre: false }) : currentPath!;

  const { data, error }: { data?: any; error?: any } = useSWR(currentRequestKey, currentFetcher, {
    initialData: currentInitialData,
    revalidateOnMount,
    revalidateOnFocus,
  });

  const currentData = data ? autoTransformData(data) : null;

  autoUpdateState<T>({ needUpdate, initialData: currentInitialData, apiPath, currentData, dispatch });

  if (error) return loadError(error.toString());

  if (currentData) {
    // make soure not flash if data loaded
    cancel(currentPath!);

    return loaded(currentData);
  }

  if (initialData) {
    cancel(currentPath!);

    return loaded(initialData);
  }

  return loadingEle;
};

export default LoadRender;
