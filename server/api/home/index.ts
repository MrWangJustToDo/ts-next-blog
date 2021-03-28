import { apiName } from "config/api";
import { getBlogsByParams, getHomeAction } from "./home";

const homeHandler = {
  [apiName.home]: getHomeAction,
  [apiName.search]: getBlogsByParams,
};

export { homeHandler };
