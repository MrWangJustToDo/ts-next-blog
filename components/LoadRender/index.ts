import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import isEqual from "lodash/isEqual";
import Loading from "components/Loading";
import loadingError from "./loadingError";
import { cancel, delay } from "utils/delay";
import { createRequest } from "utils/fetcher";
import { autoTransformData } from "utils/data";
import { useCurrentState } from "hook/useBase";
import { getDataSucess_Server } from "store/reducer/server/action";
import { AutoUpdateStateType, GetCurrentInitialDataType, LoadRenderProps, LoadRenderType } from "types/components";

let LoadRender: LoadRenderType;

let getCurrentInitialData: GetCurrentInitialDataType;

let autoUpdateState: AutoUpdateStateType;

LoadRender = <T>({
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
}: LoadRenderProps<T>) => {
  if (!path && !apiPath) throw new Error("loadrender error, path undefined!");

  const [loadingEle, setLoadingEle] = useState<JSX.Element | null>(null);

  const currentPath = apiPath ? apiPath : path;

  useEffect(() => {
    delay(delayTime, () => setLoadingEle(loading({ _style: placeholder })), currentPath);
    return () => cancel(currentPath!);
  }, [method, query, requestData, delayTime, currentPath]);

  const defaultFetcher = useMemo(() => createRequest({ method, data: requestData, header: { apiToken: token } }).run, [method, requestData, token]);

  const currentFetcher = fetcher ? fetcher : defaultFetcher;

  const { initialData: currentInitialData, dispatch } = getCurrentInitialData({ initialData, apiPath, needinitialData });

  const { data, error }: { data?: any; error?: any } = useSWR([currentPath, query], currentFetcher, { initialData: currentInitialData, revalidateOnMount });

  const currentData = data ? autoTransformData(data) : null;

  autoUpdateState<T>({ needUpdate, initialData: currentInitialData, apiPath, currentData, dispatch });

  if (error) return loadError(error.toString());

  if (currentData) {
    // make soure not flash if data loaded
    cancel(currentPath!);
    return loaded(currentData);
  }

  return loadingEle;
};

getCurrentInitialData = ({ initialData, apiPath, needinitialData }) => {
  const { state, dispatch } = useCurrentState();
  if (initialData) return { initialData, dispatch };
  if (apiPath && needinitialData) return { initialData: state.server[apiPath]["data"], dispatch };
  return { dispatch };
};

autoUpdateState = ({ needUpdate, initialData, apiPath, currentData, dispatch }) => {
  useEffect(() => {
    if (needUpdate && apiPath && !isEqual(initialData, currentData)) {
      dispatch(getDataSucess_Server({ name: apiPath, data: currentData }));
    }
  }, [needUpdate, apiPath, initialData, currentData]);
};

export default LoadRender;
