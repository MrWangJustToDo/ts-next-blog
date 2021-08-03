import Image from "components/Image";
import { getClass } from "utils/dom";
import { BlogItemRightType } from "types/components";

import style from "./index.module.scss";

const BlogItemRight: BlogItemRightType = ({ src }) => {
  return (
    <div className={getClass("col-lg-4 mb-4 my-lg-0 col-sm-5")}>
      <div className={getClass(style.imgHover, "rounded overflow-hidden")}>
        <Image src={src} width="80%" height="50%" layout="responsive" alt="blog picture" />
      </div>
    </div>
  );
};

export default BlogItemRight;
