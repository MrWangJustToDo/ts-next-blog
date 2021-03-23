import { apiName } from "config/api";
import { getChildMessageByPrimaryIdAction, getPrimaryMessageByBlogIdAction } from "./message";

const messageHandler = {
  [apiName.primaryMessage]: getPrimaryMessageByBlogIdAction,
  [apiName.childMessage]: getChildMessageByPrimaryIdAction,
};

export { messageHandler };
