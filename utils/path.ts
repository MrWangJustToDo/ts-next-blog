import { log } from "./log";
import { TransformPathType } from "types/utils";

export const transformPath: TransformPathType = ({ path, apiPath, query, needPre = true }) => {
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
      currentPath = process.env.NEXT_PUBLIC_API_HOST + currentPath;
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
    const queryObject = new URLSearchParams(query);
    currentPath += queryObject.toString();
  }
  return currentPath;
};
