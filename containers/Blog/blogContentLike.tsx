import LoadRender from "components/LoadRender";
import BlogContentLikeToPayModule from "./blogContentLikeToPayModule";
import { flexCenter, getClass } from "utils/dom";
import { BlogContentType } from "types/containers";
import { useLikeToPayModule } from "hook/useBlog";
import { apiName } from "config/api";
import { AuthorProps } from "types/hook";

const BlogContentLike: BlogContentType = ({ userId, blogPriseState }) => {
  const body = (
    <LoadRender<AuthorProps>
      apiPath={apiName.author}
      query={{ userId: userId! }}
      loaded={({ userAlipay, userWechat }) => <BlogContentLikeToPayModule aliUrl={userAlipay!} wchatUrl={userWechat!} />}
    />
  );

  const click = useLikeToPayModule({ body });

  return (
    <li className="list-group-item">
      <div className={getClass("card-body text-center", flexCenter)}>
        <button className="btn btn-sm btn-outline-danger mx-2 mx-md-5 rounded-pill" disabled>
          <i className="ri-thumb-up-line align-middle mr-2" />
          <span>点赞</span>
        </button>
        <button className="btn btn-sm btn-outline-danger mx-2 mx-md-5 rounded-pill" disabled>
          <i className="ri-star-line align-middle mr-2"></i>
          <span>收藏</span>
        </button>
        {blogPriseState ? (
          <button className="btn btn-sm btn-outline-danger mx-2 mx-md-5 rounded-pill" onClick={click}>
            <i className="ri-award-line align-middle mr-2"></i>
            <span>打赏</span>
          </button>
        ) : null}
      </div>
    </li>
  );
};

export default BlogContentLike;
