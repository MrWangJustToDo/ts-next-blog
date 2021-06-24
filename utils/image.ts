import { createRequest } from "./fetcher";
import { transformPath } from "./path";
import { autoTransformData } from "./data";
import { ApiRequestResult, LoadImgType } from "types/utils";

const loadImg: LoadImgType = ({ imgUrl, strUrl, imgElement, state = true }) => {
  if (state) {
    return new Promise<HTMLImageElement>((resolve) => {
      imgElement.setAttribute("src", transformPath({ apiPath: imgUrl, query: { time: String(Date.now()) } }));
      imgElement.addEventListener("load", () => resolve(imgElement));
    }).then((imgEle) =>
      createRequest({ apiPath: strUrl, cache: false })
        .run<ApiRequestResult<string>>()
        .then((data) => autoTransformData<string, {}>(data))
        .then((value) => imgEle.setAttribute("title", <string>value))
    );
  } else {
    return Promise.resolve();
  }
};

export { loadImg };
