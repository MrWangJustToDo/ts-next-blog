import { apiName } from "config/api";
import { getHomeData } from "./home";
import { getTypeData } from "./type";
import { getTagData } from "./tag";
import { getBlogData } from "./blog";

interface SagaConfig {
  [props: string]: any;
}

const sagaConfig: SagaConfig = {
  [apiName.home]: getHomeData,
  [apiName.type]: getTypeData,
  [apiName.tag]: getTagData,
  [apiName.blog]: getBlogData,
};

export default sagaConfig;
