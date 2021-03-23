import Link from "next/link";
import { SimpleElement } from "types/components";

let NotLogin: SimpleElement;

NotLogin = () => {
  return (
    <div className="jumbotron my-3 small">
      <h1 className="display-4">访问错误！</h1>
      <p className="lead">请登录后继续！</p>
      <hr className="my-4" />
      <p>点击按钮去登录</p>
      <Link href="/login">
        <a className="btn btn-primary" type="button">
          去登录
        </a>
      </Link>
    </div>
  );
};

export default NotLogin;
