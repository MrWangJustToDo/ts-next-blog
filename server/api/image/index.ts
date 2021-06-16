import { apiName } from "config/api";
import { getRandomImageAction, getImagesAction } from "./image";
import { getCaptchaAction, getCaptchaStrAction } from "./captcha";

const imageHandler = {
  [apiName.captcha]: getCaptchaAction,
  [apiName.image]: getRandomImageAction,
  [apiName.allImage]: getImagesAction,
  [apiName.captchaStr]: getCaptchaStrAction,
};

export { imageHandler };
