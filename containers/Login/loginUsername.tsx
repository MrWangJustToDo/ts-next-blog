import { Input } from "components/Input";
import { login } from "config/user";

export const LoginUsername = ({ setState }: { setState: (p: boolean) => void }) => {
  return (
    <div className="form-group row align-items-center position-relative">
      <label htmlFor="username" className="col-sm-3 col-form-label">
        姓名:
      </label>
      <Input option={login.username} name="username" placeHolder="请输入用户名" outerClassName="col-sm-9 p-0" changeState={setState} />
    </div>
  );
};
