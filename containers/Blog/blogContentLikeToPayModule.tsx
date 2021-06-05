import { BlogContentLikeToPayModuleType } from "types/containers";

const BlogContentLikeToPayModule: BlogContentLikeToPayModuleType = ({ aliUrl, wchatUrl }) => {
  return (
    <div className="d-flex justify-content-center">
      <div className="bg-white">
        <div className="mr-4 card d-inline-block">
          <div className="card-header">微信打赏</div>
          <img src={wchatUrl} width="130" alt="..." />
        </div>
        <div className="ml-4 card d-inline-block">
          <div className="card-header">支付宝打赏</div>
          <img src={aliUrl} width="130" alt="..." />
        </div>
      </div>
    </div>
  );
};

export default BlogContentLikeToPayModule;
