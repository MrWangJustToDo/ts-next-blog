import Image from "next/image";
import { SimpleElement } from "types/components";
import { getClass, flexCenter } from "utils/class";

import style from "./index.module.scss";

let FootContainerCardMe: SimpleElement;

FootContainerCardMe = () => {
  return (
    <div className="col-4 col-lg-2 border-right border-secondary d-flex justify-content-center justify-content-lg-start">
      <div className={getClass(style.img, flexCenter)}>
        <Image src={process.env.NEXT_PUBLIC_ADMIN} className="rounded img-thumbnail" width="100%" height="100%" title="扫码添加好友" />
      </div>
    </div>
  );
};

export default FootContainerCardMe;
