import { apiName } from "config/api";
import { addTagAction, checkTagAction, deleteTagAction, getTagAction } from "./tag";

const tagHandler = {
  [apiName.tag]: getTagAction,
  [apiName.addTag]: addTagAction,
  [apiName.checkTag]: checkTagAction,
  [apiName.deleteTag]: deleteTagAction,
};

export { tagHandler };
