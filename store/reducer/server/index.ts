import { combineReducers } from "redux";
import home from "./home";
import type from "./type";
import tag from "./tag";
import blog from "./blog";
import userHome from "./userHome";
import { apiName } from "config/api";

export default combineReducers({
  [apiName.home]: home,
  [apiName.type]: type,
  [apiName.tag]: tag,
  [apiName.blog]: blog,
  [apiName.userHome]: userHome,
});
