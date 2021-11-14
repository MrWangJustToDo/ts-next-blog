import { useRef } from "react";
import { Image } from "components/Image";
import { usePinch } from "hook/usePinch";

export const BlogContentLikeToPayModule = ({ aliUrl, wChatUrl }: { aliUrl: string; wChatUrl: string }) => {
  const coverRef = useRef<HTMLDivElement>(null);
  const [pinchRef1] = usePinch<HTMLDivElement, HTMLDivElement>({ forWardCoverRef: coverRef });
  const [pinchRef2] = usePinch<HTMLDivElement, HTMLDivElement>({ forWardCoverRef: coverRef });
  return (
    <div className="d-flex justify-content-center">
      <div className="bg-white" ref={coverRef}>
        <div className="mr-4 card d-inline-block">
          <div className="card-header">微信打赏</div>
          <div ref={pinchRef1}>
            <Image src={wChatUrl} width="130" alt="..." />
          </div>
        </div>
        <div className="ml-4 card d-inline-block">
          <div className="card-header">支付宝打赏</div>
          <div ref={pinchRef2}>
            <Image src={aliUrl} width="130" alt="..." />
          </div>
        </div>
      </div>
    </div>
  );
};
