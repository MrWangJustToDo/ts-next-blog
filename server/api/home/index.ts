import { apiName } from "config/api";
import { getHomeAction } from "./home";

const homeHandler = {
  [apiName.home]: getHomeAction,
};

export { homeHandler };
