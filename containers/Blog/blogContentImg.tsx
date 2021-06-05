import Image from "next/image";
import { getClass } from "utils/dom";
import { BlogContentImgType } from "types/containers";

import style from "./index.module.scss";

const BlogContentImg: BlogContentImgType = ({ src }) => {
  return (
    <li className="list-group-item">
      <div className="card-body">
        <div className={getClass("rounded overflow-hidden", style.imgHover)}>
          <Image src={src} alt="blog" width="100%" height="50%" layout="responsive" />
        </div>
      </div>
    </li>
  );
};

export default BlogContentImg;
