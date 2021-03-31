import { apiName } from "config/api";
import {
  getChildMessageByPrimaryIdAction,
  getPrimaryMessageByBlogIdAction,
  publishChildMessageByPrimaryIdAction,
  publishPrimaryMessageByBlogIdAction,
} from "./message";

const messageHandler = {
  [apiName.primaryMessage]: getPrimaryMessageByBlogIdAction,
  [apiName.childMessage]: getChildMessageByPrimaryIdAction,
  [apiName.putPrimaryMessage]: publishPrimaryMessageByBlogIdAction,
  [apiName.putChildMessage]: publishChildMessageByPrimaryIdAction,
};

export { messageHandler };
