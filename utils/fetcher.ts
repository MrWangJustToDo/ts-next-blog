import { AxiosResponse } from "axios";
import assign from "lodash/assign";
import { apiName, cacheApi } from "config/api";
import { Cache } from "./cache";
import { instance } from "./request";
import { getHeader } from "./headers";
import { transformPath } from "./path";
import { AutoRequestProps, AutoRequestType, CreateRequestType, QueryProps } from "types/utils";

let createRequest: CreateRequestType;

const cache = new Cache<string, any>();

createRequest = (props: AutoRequestProps = {}) => {
  const { method, path, apiPath, query, data, header } = props;
  const tempPath = transformPath({ path, apiPath });
  const autoRequest: AutoRequestType = (props: AutoRequestProps = {}) => {
    const newMethod = props.method ? props.method : method;
    const newPath = props.path ? props.path : path;
    const newApiPath = props.apiPath ? props.apiPath : apiPath;
    const newQuery = props.query !== false ? assign(query, props.query) : undefined;
    const newData = props.data !== false ? assign(data, props.data) : undefined;
    const newHeader = props.header !== false ? assign(header, props.header) : undefined;
    return createRequest({
      method: newMethod,
      path: newPath,
      apiPath: newApiPath,
      query: newQuery,
      data: newData,
      header: newHeader,
    });
  };
  autoRequest.run = <T>(currentPath?: string, currentQuery?: QueryProps) => {
    const targetPath = currentPath ? currentPath : tempPath;
    if (!targetPath) {
      throw new Error("request path should not undefined!!");
    }

    const targetQuery = assign(query, currentQuery);

    const relativePath = targetPath.startsWith("http")
      ? transformPath({ path: targetPath, query: targetQuery })
      : transformPath({ apiPath: targetPath as apiName, query: targetQuery });

    if ((process as any).browser && cacheApi.includes(targetPath as apiName)) {
      const target = cache.get(relativePath);
      if (target) {
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
    if ((process as any).browser && cacheApi.includes(targetPath as apiName)) {
      return requestPromise.then((res) => res.data).then((resData) => (cache.set(relativePath, resData), resData));
    } else {
      return requestPromise.then((res) => res.data);
    }
  };
  return autoRequest;
};

export { createRequest };
