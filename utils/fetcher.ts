import { AxiosResponse } from "axios";
import assign from "lodash/assign";
import { log } from "./log";
import { Cache } from "./cache";
import { apiName } from "config/api";
import { instance } from "./request";
import { getHeader } from "./headers";
import { transformPath } from "./path";
import { AutoRequestProps, AutoRequestType, CreateRequestType, QueryProps } from "types/utils";

const cacheResult = new Cache<string, any>(5000);

const autoParse = (params: string | any) => {
  if (typeof params === "string") {
    return JSON.parse(params);
  } else if (params) {
    return params;
  } else {
    return undefined;
  }
};

const autoStringify = (params: string | any) => {
  if (typeof params === "string") {
    return params;
  } else if (params) {
    return JSON.stringify(params);
  } else {
    return undefined;
  }
};

const autoAssignParams = (oldParams: string | false | object | undefined, newParams: string | false | object | undefined) => {
  if (newParams === false) {
    return undefined;
  } else {
    return assign(autoParse(oldParams), autoParse(newParams));
  }
};

const createRequest: CreateRequestType = (props: AutoRequestProps = {}) => {
  const { method, path, apiPath, query, data, header, cache = true } = props;

  const tempPath = apiPath ? apiPath : path;

  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;

    const newPath = props.path ? props.path : path;

    const newApiPath = props.apiPath ? props.apiPath : apiPath;

    const newQuery = autoAssignParams(query, props.query);

    const newData = autoAssignParams(data, props.data);

    const newHeader = autoAssignParams(header, props.header);

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

    const targetQuery = autoAssignParams(query, currentQuery);

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

    const currentHeader = header !== false && (process as any).browser ? getHeader(autoParse(header)) : autoParse(header);

    const currentData = data !== false ? autoParse(data) : undefined;

    const requestPromise: Promise<AxiosResponse<T>> = instance({
      method: currentMethod,
      headers: currentHeader,
      url: relativePath,
      data: currentData,
    });

    if ((process as any).browser && cache) {
      return requestPromise.then((res) => res.data).then((resData) => (cacheResult.set(relativePath, resData), resData));
    } else {
      return requestPromise.then((res) => res.data);
    }
  };
  return autoRequest;
};

export { createRequest, autoAssignParams, autoStringify };
