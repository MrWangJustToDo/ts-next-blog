import { createRequest } from "./fetcher";
import { transformPath } from "./path";
import { autoTransformData } from "./data";
import { ApiRequestResult, LoadImgType } from "types/utils";

const request = createRequest();

let loadImg: LoadImgType;

loadImg = ({ imgUrl, strUrl, imgElement }) => {
  return new Promise<HTMLImageElement>((resolve) => {
    imgElement.setAttribute("src", transformPath({ apiPath: imgUrl, query: { time: String(Date.now()) } }));
    imgElement.addEventListener("load", () => resolve(imgElement));
  }).then((imgEle) =>
    request
      .run<ApiRequestResult<string>>(transformPath({ apiPath: strUrl, query: { time: String(Date.now()) } }))
      .then((data) => autoTransformData<string, {}>(data))
      .then((value) => imgEle.setAttribute("title", <string>value))
  );
};

export { loadImg };