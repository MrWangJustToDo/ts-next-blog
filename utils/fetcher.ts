import { AxiosResponse } from "axios";
import assign from "lodash/assign";
import { log } from "./log";
import { Cache } from "./cache";
import { isBrowser } from "./env";
import { instance } from "./request";
import { getHeader } from "./headers";
import { transformPath } from "./path";
import { AutoRequestProps, AutoRequestType, CreateRequestType } from "types/utils";

const cacheResult = new Cache<string, Promise<any>>(60000);

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
  const { method, path, apiPath, query, data, header, cache = true, encode = false, cacheTime } = props;

  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;

    const newPath = props.path ? props.path : path;

    const newApiPath = props.apiPath ? props.apiPath : apiPath;

    const newQuery = autoAssignParams(query, props.query);

    const newData = autoAssignParams(data, props.data);

    const newHeader = autoAssignParams(header, props.header);

    const newCache = props.cache === false ? false : cache;

    const newEncode = props.encode === false ? false : encode;

    const newCacheTime = props.cacheTime || cacheTime;

    return createRequest({
      method: newMethod,
      path: newPath,
      apiPath: newApiPath,
      query: newQuery,
      data: newData,
      header: newHeader,
      cache: newCache,
      encode: newEncode,
      cacheTime: newCacheTime,
    });
  };

  autoRequest.advance = (transform) => {
    const newProps = transform(props);
    return createRequest({ ...props, ...newProps });
  };

  let cacheKey: string | null = null;

  autoRequest.cache = cacheResult;

  autoRequest.cacheKey = "";

  autoRequest.deleteCache = () => {
    autoRequest.cache.deleteRightNow(autoRequest.cacheKey);
    return autoRequest;
  };

  autoRequest.run = <T>() => {
    const targetRelativePath = autoRequest.cacheKey;

    if (isBrowser && cache) {
      const target = cacheResult.get(targetRelativePath);
      if (target) {
        log(`get data from cache, key: ${targetRelativePath}, path: ${path}, apiName: ${apiPath}`, "normal");
        return target.then((res) => <T>res.data);
      }
    }

    const currentHeader = header !== false && isBrowser ? getHeader(autoParse(header)) : autoParse(header);

    const currentData = data !== false ? (encode ? { encode: btoa(autoStringify(data)!) + process.env.NEXT_PUBLIC_STRING } : autoParse(data)) : undefined;

    const currentMethod = method || currentData ? "POST" : "GET";

    const requestPromise: Promise<AxiosResponse<T>> = instance({
      method: currentMethod,
      headers: currentHeader,
      url: targetRelativePath,
      data: currentData,
    });

    if (isBrowser && cache) {
      cacheResult.set(targetRelativePath, requestPromise, cacheTime);
      const re = requestPromise.then((res) => res.data);
      re.catch(() => cacheResult.deleteRightNow(targetRelativePath));
      return re;
    } else {
      return requestPromise.then((res) => res.data);
    }
  };

  Object.defineProperty(autoRequest, "cacheKey", {
    get() {
      if (cacheKey) return cacheKey;
      cacheKey = transformPath({ path, apiPath, query: autoParse(query) });
      return cacheKey;
    },
  });

  return autoRequest;
};

if (isBrowser && process.env.NODE_ENV === "development") {
  (window as any).__cache = cacheResult;
  (window as any).__request = createRequest;
}

export { createRequest, autoAssignParams, autoStringify };
