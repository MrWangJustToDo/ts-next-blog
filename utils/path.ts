import { log } from "./log";
import { TransformPathType } from "types/utils";

let transformPath: TransformPathType;

transformPath = ({ path, apiPath, query, needPre = true }) => {
  if (!path && !apiPath) {
    log(`transform path not exist`, "warn");
    return "";
  }
  let currentPath = "";
  if (path) {
    if (!path.startsWith("http")) {
      log(`Incomplete path! third part request, path : ${path}`, "warn");
    } else {
      log(`third part link : ${path}`, "normal");
    }
    currentPath = path;
  } else if (apiPath) {
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
  }
  if (query) {
    currentPath += "?";
    for (let key in query) {
      currentPath += `${key}=${query[key]}&`;
    }
    currentPath = currentPath.slice(0, -1);
  }
  return currentPath;
};

export { transformPath };
