import { AxiosResponse } from "axios";
import assign from "lodash/assign";
import { apiName } from "config/api";
import { Cache } from "./cache";
import { instance } from "./request";
import { getHeader } from "./headers";
import { transformPath } from "./path";
import { AutoRequestProps, AutoRequestType, CreateRequestType, QueryProps } from "types/utils";
import { log } from "./log";

let createRequest: CreateRequestType;

const cacheResult = new Cache<string, any>(5000);

createRequest = (props: AutoRequestProps = {}) => {
  const { method, path, apiPath, query, data, header, cache = true } = props;

  const tempPath = apiPath ? apiPath : path;

  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;

    const newPath = props.path ? props.path : path;

    const newApiPath = props.apiPath ? props.apiPath : apiPath;

    const newQuery = props.query !== false ? assign(query, props.query) : undefined;

    const newData = props.data !== false ? assign(data, props.data) : undefined;

    const newHeader = props.header !== false ? assign(header, props.header) : undefined;

    const newCache = props.cache === false ? false : cache;

    return createRequest({
      method: newMethod,
      path: newPath,
      apiPath: newApiPath,
      query: newQuery,
      data: newData,
      header: newHeader,
      cache: newCache,
    });
  };

  autoRequest.run = <T>(currentPath?: string, currentQuery?: QueryProps | string) => {
    const targetPath = currentPath ? currentPath : tempPath;

    if (!targetPath) {
      throw new Error("request path should not undefined!!");
    }

    const currentQueryObj = currentQuery && typeof currentQuery === "string" ? JSON.parse(currentQuery) : currentQuery;

    const targetQuery = assign(query, currentQueryObj);

    const relativePath = targetPath.startsWith("http")
      ? transformPath({ path: targetPath, query: targetQuery })
      : transformPath({ apiPath: targetPath as apiName, query: targetQuery });

    if ((process as any).browser && cache) {
      const target = cacheResult.get(relativePath);
      if (target) {
        log(`get data from cache, key: ${relativePath}, path: ${targetPath}, apiName: ${apiPath}`, "normal");
        return Promise.resolve(<T>target);
      }
    }

    const currentMethod = method || "get";

    const currentHeader = header !== undefined && header !== false && (process as any).browser ? getHeader(header) : header;

    let requestPromise: Promise<AxiosResponse<T>>;

    requestPromise = instance({
      method: currentMethod,
      headers: currentHeader,
      url: relativePath,
      data,
    });

    if ((process as any).browser && cache) {
      return requestPromise.then((res) => res.data).then((resData) => (cacheResult.set(relativePath, resData), resData));
    } else {
      return requestPromise.then((res) => res.data);
    }
  };
  return autoRequest;
};

export { createRequest };
