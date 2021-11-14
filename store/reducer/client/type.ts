import { actionName } from "config/action";
import {
  archiveReducer,
  blogIdReducer,
  headerReducer,
  homePageReducer,
  ipReducer,
  resultReducer,
  tagPageReducer,
  tagReducer,
  tokenReducer,
  typePageReducer,
  typeReducer,
  userReducer,
} from "./action";

export type ClientReducerKey = actionName;

export type ClientReducer = {
  [actionName.currentArchive]: ReturnType<typeof archiveReducer>;
  [actionName.currentBlogId]: ReturnType<typeof blogIdReducer>;
  [actionName.currentHeader]: ReturnType<typeof headerReducer>;
  [actionName.currentHomePage]: ReturnType<typeof homePageReducer>;
  [actionName.currentIp]: ReturnType<typeof ipReducer>;
  [actionName.currentResult]: ReturnType<typeof resultReducer>;
  [actionName.currentTag]: ReturnType<typeof tagReducer>;
  [actionName.currentTagPage]: ReturnType<typeof tagPageReducer>;
  [actionName.currentToken]: ReturnType<typeof tokenReducer>;
  [actionName.currentType]: ReturnType<typeof typeReducer>;
  [actionName.currentTypePage]: ReturnType<typeof typePageReducer>;
  [actionName.currentUser]: ReturnType<typeof userReducer>;
};
