import { getRandom } from "utils/data";
import { createRequest } from "utils/fetcher";
import { catchHandler, transformHandler, success, fail } from "server/middleware/apiHandler";

// 获取图片请求链接
const getImagePath = () => {
  const idx = String(getRandom(7));
  const n = String(getRandom(1, 7));
  let requestUrl = String(process.env.BINGAPI);
  requestUrl = requestUrl.replace("--n--", n);
  requestUrl = requestUrl.replace("--idx--", idx);
  return requestUrl;
};

// 获取所有随机图片信息
const getImagesAction = transformHandler(
  catchHandler(
    async ({ res }) => {
      let { images } = await createRequest({path: getImagePath()}).run();
      images = images.map((item: { [props: string]: string }) => {
        return { ...item, relativeUrl: `${process.env.BINGURL}${item.url}` };
      });
      success({ res, resDate: { data: images } });
    },
    ({ res, e }) => fail({ res, resDate: { data: e.toString(), methodName: "getImagesAction" } })
  )
);

// 获取随机图片信息
const getRandomImageAction = transformHandler(
  catchHandler(
    async ({ res }) => {
      const { images } = await createRequest({path: getImagePath()}).run();
      const [{ relativeUrl }] = images.map((item: { [props: string]: string }) => ({ relativeUrl: `${process.env.BINGURL}${item.url}` }));
      success({ res, resDate: { data: relativeUrl } });
    },
    ({ res, e }) => fail({ res, resDate: { data: e.toString(), methodName: "getRandomImageAction" } })
  )
);

export { getImagesAction, getRandomImageAction };
