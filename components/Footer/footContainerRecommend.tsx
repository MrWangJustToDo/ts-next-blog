import { getClass, flexCenter } from "utils/class";
import { footContentLength, footRecommendContent } from "config/footer";
import FootContainerContentItem from "./footContainerContentItem";
import { FootContainerRecommendType } from "types/components";

import style from "./index.module.scss";

const FootContainerRecommend: FootContainerRecommendType = ({ length = footContentLength }) => {
  return (
    <div className="col-4 col-lg-3 text-white">
      <h6 className={getClass(style.fontInherit, "my-2 mb-lg-3", flexCenter)}>
        <i className="ri-link mr-2"></i>
        <div>推荐</div>
      </h6>
      <ul className="list-unstyled m-0">
        {footRecommendContent.slice(0, length).map(({ content, hrefTo }) => (
          <FootContainerContentItem key={content} content={content} hrefTo={hrefTo} />
        ))}
      </ul>
    </div>
  );
};
export default FootContainerRecommend;
