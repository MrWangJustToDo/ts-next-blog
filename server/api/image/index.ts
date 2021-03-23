import { apiName } from "config/api";
import { getRandomImageAction } from "./image";
import { getCaptchaAction, getCaptchaStrAction } from "./captcha";

const imageHandler = {
  [apiName.captcha]: getCaptchaAction,
  [apiName.image]: getRandomImageAction,
  [apiName.captchaStr]: getCaptchaStrAction,
};

export { imageHandler };
