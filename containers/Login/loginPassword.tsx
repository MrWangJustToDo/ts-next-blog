import Input from "components/Input";
import { login } from "config/user";
import { LoginInputType } from "types/containers";

const LoginPassword: LoginInputType = ({ setState }) => {
  return (
    <div className="form-group row align-items-center position-relative">
      <label htmlFor="password" className="col-sm-3 col-form-label">
        密码:
      </label>
      <Input placeHolder="请输入密码" option={login.password} type="password" outerClassName="col-sm-9 p-0" name="password" changeState={setState} />
    </div>
  );
};

export default LoginPassword;
