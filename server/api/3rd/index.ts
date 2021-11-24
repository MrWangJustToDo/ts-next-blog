import { apiName } from "config/api";
import { get3rdRequestAction } from "./3rd";

const thirdRequestHandler = {
  [apiName.thirdPath]: get3rdRequestAction,
};

export { thirdRequestHandler };
