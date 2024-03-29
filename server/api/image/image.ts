import { getRandom } from "utils/data";
import { createRequest } from "utils/fetcher";
import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

// 获取图片请求链接
const getImagePath = () => {
  const idx = String(getRandom(7));
  const n = String(getRandom(1, 7));
  let requestUrl = String(process.env.BING_API);
  requestUrl = requestUrl.replace("--n--", n);
  requestUrl = requestUrl.replace("--idx--", idx);
  return requestUrl;
};

// 获取所有随机图片信息
const getImagesAction = wrapperMiddlewareRequest(
  {
    requestHandler: async function getImagesAction({ res }) {
      let { images } = await createRequest({ path: getImagePath() }).run();
      images = images.map((item: { [props: string]: string }) => {
        return { ...item, relativeUrl: `${process.env.BING_URL}${item.url}` };
      });
      success({ res, resDate: { data: images } });
    },
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

// 获取随机图片信息
const getRandomImageAction = wrapperMiddlewareRequest(
  {
    requestHandler: async function getRandomImageAction({ res }) {
      const { images } = await createRequest({ path: getImagePath() }).run();
      const [{ relativeUrl }] = images.map((item: { [props: string]: string }) => ({ relativeUrl: `${process.env.BING_URL}${item.url}` }));
      success({ res, resDate: { data: relativeUrl } });
    },
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

export { getImagesAction, getRandomImageAction };
