import { Image } from "components/Image";
import { getClass } from "utils/dom";

import style from "./index.module.scss";

export const BlogItemRight = ({ src }: { src: string }) => {
  return (
    <div className={getClass("col-lg-4 mb-4 my-lg-0 col-sm-5 p-lg-1")}>
      <div className={getClass(style.imgHover, "rounded overflow-hidden")}>
        <Image src={src} width="90%" height="50%" layout="responsive" alt="blog picture" />
      </div>
    </div>
  );
};
