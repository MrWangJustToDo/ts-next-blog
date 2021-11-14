import { Image } from "components/Image";
import { getClass, flexCenter } from "utils/dom";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

export const FootContainerCardMe: SimpleElement = () => {
  return (
    <div className="col-4 col-lg-2 border-right border-secondary d-flex justify-content-center justify-content-lg-start">
      <div className={getClass(style.img, flexCenter)}>
        <Image src={process.env.NEXT_PUBLIC_ADMIN} className="rounded img-thumbnail" width="100%" height="100%" title="扫码添加好友" alt="扫码添加好友" />
      </div>
    </div>
  );
};
