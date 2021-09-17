import { useRef } from "react";
import { usePinch } from "hook/usePinch";
import { BlogContentLikeToPayModuleType } from "types/containers";

const BlogContentLikeToPayModule: BlogContentLikeToPayModuleType = ({ aliUrl, wchatUrl }) => {
  const coverRef = useRef<HTMLDivElement>(null);
  const [pinchRef1] = usePinch<HTMLImageElement, HTMLDivElement>({ forWardCoverRef: coverRef });
  const [pinchRef2] = usePinch<HTMLImageElement, HTMLDivElement>({ forWardCoverRef: coverRef });
  return (
    <div className="d-flex justify-content-center">
      <div className="bg-white" ref={coverRef}>
        <div className="mr-4 card d-inline-block">
          <div className="card-header">微信打赏</div>
          <img src={wchatUrl} width="130" alt="..." ref={pinchRef1} />
        </div>
        <div className="ml-4 card d-inline-block">
          <div className="card-header">支付宝打赏</div>
          <img src={aliUrl} width="130" alt="..." ref={pinchRef2} />
        </div>
      </div>
    </div>
  );
};

export default BlogContentLikeToPayModule;
