import { apiName } from "config/api";
import {
  deleteChildMessageByCommentIdAction,
  getChildMessageByPrimaryIdAction,
  publishChildMessageByPrimaryIdAction,
  updateChildMessageByCommentIdAction,
} from "./childMessage";
import {
  deletePrimaryMessageByCommentIdAction,
  getPrimaryMessageByBlogIdAction,
  publishPrimaryMessageByBlogIdAction,
  updatePrimaryMessageByCommentIdAction,
} from "./primaryMessage";

const messageHandler = {
  [apiName.childMessage]: getChildMessageByPrimaryIdAction,
  [apiName.primaryMessage]: getPrimaryMessageByBlogIdAction,
  [apiName.putChildMessage]: publishChildMessageByPrimaryIdAction,
  [apiName.putPrimaryMessage]: publishPrimaryMessageByBlogIdAction,
  [apiName.deleteChildMessage]: deleteChildMessageByCommentIdAction,
  [apiName.deletePrimaryMessage]: deletePrimaryMessageByCommentIdAction,
  [apiName.updateChildMessage]: updateChildMessageByCommentIdAction,
  [apiName.updatePrimaryMessage]: updatePrimaryMessageByCommentIdAction,
};

export { messageHandler };
