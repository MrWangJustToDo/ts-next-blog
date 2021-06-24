import { log } from "./log";
import { TransformPathType } from "types/utils";

const transformPath: TransformPathType = ({ path, apiPath, query, needPre = true }) => {
  if (!path && !apiPath) {
    log(`transform path not exist`, "warn");
    return "";
  } else if (path && apiPath) {
    log(`multiple path discover. path: ${path}, apiPath: ${apiPath}`, "error");
  }
  let currentPath = "";
  if (apiPath) {
    currentPath = apiPath;
    if (!currentPath.startsWith("/")) {
      currentPath = "/" + apiPath;
    }
    if (!currentPath.startsWith("/api")) {
      currentPath = "/api" + currentPath;
    }
    if (needPre) {
      currentPath = process.env.NEXT_PUBLIC_APIHOST + currentPath;
      if (!currentPath.startsWith("http")) {
        currentPath = "http://" + currentPath;
      }
    }
  } else if (path) {
    if (!path.startsWith("http")) {
      log(`Incomplete path! third part link, path : ${path}`, "warn");
    } else {
      log(`third part link, path ${path}`, "normal");
    }
    currentPath = path;
  }
  if (query) {
    if (!currentPath.includes("?")) {
      currentPath += "?";
    } else {
      currentPath += "&";
    }
    for (let key in query) {
      if (query[key] !== undefined) {
        const targetParams = `${key}=${query[key]}`;
        if (!currentPath.includes(targetParams)) {
          currentPath += `${targetParams}&`;
        }
      }
    }
    currentPath = currentPath.slice(0, -1);
  }
  return currentPath;
};

export { transformPath };
