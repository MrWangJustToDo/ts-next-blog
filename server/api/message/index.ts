import { apiName } from "config/api";
import {
  getPrimaryMessageByBlogIdAction,
  getChildMessageByPrimaryIdAction,
  publishPrimaryMessageByBlogIdAction,
  publishChildMessageByPrimaryIdAction,
  deleteChildMessageByCommentIdAction,
  deletePrimaryMessageByCommentIdAction,
  updateChildMessageByCommentIdAction,
  updatePrimaryMessageByCommentIdAction,
} from "./message";

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
