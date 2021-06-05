import Link from "next/link";
import { animateFadein, getClass } from "utils/dom";
import { MyNextComponent } from "./_app";

const NotFound: MyNextComponent = () => {
  return (
    <div className={getClass(animateFadein, "container-md my-5")}>
      <div className="jumbotron my-3 small">
        <h1 className="display-4">访问错误！</h1>
        <p className="lead">访问资源不存在！</p>
        <hr className="my-4" />
        <p>可能过期，删除，或者移动了⛆</p>
        <Link href="/">
          <a className="btn btn-primary" type="button">
            返回首页
          </a>
        </Link>
      </div>
    </div>
  );
};

NotFound.title = "未知页面";

export default NotFound;
