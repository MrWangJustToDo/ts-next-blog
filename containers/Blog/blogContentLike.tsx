import { useFailToast } from "hook/useToast";
import { flexCenter, getClass } from "utils/class";
import { BlogContentType } from "types/containers";

let BlogContentLike: BlogContentType;

BlogContentLike = ({ blogId, blogPriseState }) => {
  const fail = useFailToast();
  return (
    <li className="list-group-item">
      <div className={getClass("card-body text-center", flexCenter)}>
        <button className="btn btn-sm btn-outline-danger mx-2 mx-md-5 rounded-pill" onClick={() => fail("shibai")}>
          <i className="ri-thumb-up-line align-middle mr-2" />
          <span>点赞</span>
        </button>
        <button className="btn btn-sm btn-outline-danger mx-2 mx-md-5 rounded-pill">
          <i className="ri-star-line align-middle mr-2"></i>
          <span>收藏</span>
        </button>
        {blogPriseState ? (
          <button className="btn btn-sm btn-outline-danger mx-2 mx-md-5 rounded-pill">
            <i className="ri-award-line align-middle mr-2"></i>
            <span>打赏</span>
          </button>
        ) : null}
      </div>
    </li>
  );
};

export default BlogContentLike;
