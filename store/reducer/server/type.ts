import { apiName } from "config/api";
import { homeReducer, typeReducer, tagReducer, blogReducer, userHomeReducer } from "./action";

export type ServerReducerKey = apiName.home | apiName.type | apiName.tag | apiName.blog | apiName.userHome;

export type ServerReducer = {
  [apiName.home]: ReturnType<typeof homeReducer>;
  [apiName.type]: ReturnType<typeof typeReducer>;
  [apiName.tag]: ReturnType<typeof tagReducer>;
  [apiName.blog]: ReturnType<typeof blogReducer>;
  [apiName.userHome]: ReturnType<typeof userHomeReducer>;
};
