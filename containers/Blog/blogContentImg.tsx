import Image from "next/image";
import { getClass } from "utils/class";
import { BlogContentImgType } from "types/containers";

import style from "./index.module.scss";

let BlogContentImg: BlogContentImgType;

BlogContentImg = ({ src }) => {
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
