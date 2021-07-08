// import Image from "next/image";
import { getClass } from "utils/dom";
import { usePinch } from "hook/usePinch";
import { BlogContentImgType } from "types/containers";

import style from "./index.module.scss";

const BlogContentImg: BlogContentImgType = ({ src }) => {
  const [coverRef, pinchRef] = usePinch<HTMLDivElement, HTMLImageElement>();

  return (
    <li className="list-group-item overflow-hidden">
      {/* <div className="card-body"> */}
      <div ref={coverRef} className={getClass("rounded overflow-hidden", style.imgHover)}>
        <img ref={pinchRef} draggable="false" src={src} alt="blog" width="100%" height="50%" />
        {/* <Image ref src={src} alt="blog" width="100%" height="50%" layout="responsive" /> */}
      </div>
      {/* </div> */}
    </li>
  );
};

export default BlogContentImg;
