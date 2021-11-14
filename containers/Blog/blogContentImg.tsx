import Image from "next/image";
import { getClass } from "utils/dom";
import { usePinch } from "hook/usePinch";

import style from "./index.module.scss";

export const BlogContentImg = ({ src }: { src: string }) => {
  const [pinchRef, coverRef] = usePinch<HTMLDivElement, HTMLImageElement>();

  return (
    <li className="list-group-item overflow-hidden">
      {/* <div className="card-body"> */}
      <div ref={coverRef} className={getClass("rounded overflow-hidden", style.imgHover)}>
        <div ref={pinchRef}>
          <Image src={src} alt="blog" width="100%" height="50%" layout="responsive" />
          {/* <img ref={pinchRef} draggable="false" src={src} alt="blog" width="100%" height="50%" /> */}
        </div>
      </div>
      {/* </div> */}
    </li>
  );
};
