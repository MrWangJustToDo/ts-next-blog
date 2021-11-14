import { getClass, flexCenter } from "utils/dom";
import { footContentLength, footContactMe } from "config/footer";
import { FootContainerContentItem } from "./footContainerContentItem";
import { FootContainerContactMeType } from "types/components";

import style from "./index.module.scss";

export const FootContainerContactMe: FootContainerContactMeType = ({ length = footContentLength }) => {
  return (
    <div className="col-4 col-lg-3 border-right border-secondary text-white">
      <h6 className={getClass(style.fontInherit, "my-2 mb-lg-3", flexCenter)}>
        <i className="ri-contacts-line mr-2"></i>
        <div>联系我</div>
      </h6>
      <ul className="list-unstyled m-0">
        {footContactMe.slice(0, length).map(({ head, content, column }) => (
          <FootContainerContentItem key={content} head={head} content={content} column={column} />
        ))}
      </ul>
    </div>
  );
};
