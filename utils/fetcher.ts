import { AxiosResponse } from "axios";
import assign from "lodash/assign";
import { log } from "./log";
import { Cache } from "./cache";
import { instance } from "./request";
import { getHeader } from "./headers";
import { transformPath } from "./path";
import { AutoRequestProps, AutoRequestType, CreateRequestType } from "types/utils";

const cacheResult = new Cache<string, Promise<any>>(60000);

const isBrowser = typeof window !== "undefined";

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
  const { method, path, apiPath, query, data, header, cache = true, cacheTime } = props;

  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;

    const newPath = props.path ? props.path : path;

    const newApiPath = props.apiPath ? props.apiPath : apiPath;

    const newQuery = autoAssignParams(query, props.query);

    const newData = autoAssignParams(data, props.data);

    const newHeader = autoAssignParams(header, props.header);

    const newCache = props.cache === false ? false : cache;

    const newCacheTime = props.cacheTime || cacheTime;

    return createRequest({
      method: newMethod,
      path: newPath,
      apiPath: newApiPath,
      query: newQuery,
      data: newData,
      header: newHeader,
      cache: newCache,
      cacheTime: newCacheTime,
    });
  };

  const cacheKey = transformPath({ path, apiPath, query: autoParse(query) });

  autoRequest.cache = cacheResult;

  autoRequest.cacheKey = cacheKey;

  autoRequest.deleteCache = () => autoRequest.cache.deleteRightNow(autoRequest.cacheKey);

  autoRequest.run = <T>() => {
    const targetRelativePath = autoRequest.cacheKey;

    if (isBrowser && cache) {
      const target = cacheResult.get(targetRelativePath);
      if (target) {
        log(`get data from cache, key: ${targetRelativePath}, path: ${path}, apiName: ${apiPath}`, "normal");
        return target.then((res) => <T>res.data);
      }
    }

    const currentMethod = method || "get";

    const currentHeader = header !== false && isBrowser ? getHeader(autoParse(header)) : autoParse(header);

    const currentData = data !== false ? autoParse(data) : undefined;

    const requestPromise: Promise<AxiosResponse<T>> = instance({
      method: currentMethod,
      headers: currentHeader,
      url: targetRelativePath,
      data: currentData,
    });

    if (isBrowser && cache) {
      cacheResult.set(targetRelativePath, requestPromise, cacheTime);
      return requestPromise.then((res) => res.data);
    } else {
      return requestPromise.then((res) => res.data);
    }
  };

  return autoRequest;
};

export { createRequest, autoAssignParams, autoStringify };
