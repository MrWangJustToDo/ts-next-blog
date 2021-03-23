import { apiName } from "config/api";
import { addTypeAction, checkTypeAction, getTypeAction } from "./type";

const typeHandler = {
  [apiName.type]: getTypeAction,
  [apiName.addType]: addTypeAction,
  [apiName.checkType]: checkTypeAction,
};

export { typeHandler };
