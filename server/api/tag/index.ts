import { apiName } from "config/api";
import { addTagAction, checkTagAction, getTagAction } from "./tag";

const tagHandler = {
  [apiName.tag]: getTagAction,
  [apiName.addTag]: addTagAction,
  [apiName.checkTag]: checkTagAction,
};

export { tagHandler };
