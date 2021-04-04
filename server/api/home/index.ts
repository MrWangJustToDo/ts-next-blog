import { apiName } from "config/api";
import { getBlogsByParams, getHomeAction, getUserHomeAction } from "./home";

const homeHandler = {
  [apiName.home]: getHomeAction,
  [apiName.search]: getBlogsByParams,
  [apiName.userHome]: getUserHomeAction,
};

export { homeHandler };
