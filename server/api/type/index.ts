import { apiName } from "config/api";
import { addTypeAction, checkTypeAction, deleteTypeAction, getTypeAction } from "./type";

const typeHandler = {
  [apiName.type]: getTypeAction,
  [apiName.addType]: addTypeAction,
  [apiName.checkType]: checkTypeAction,
  [apiName.deleteType]: deleteTypeAction,
};

export { typeHandler };
