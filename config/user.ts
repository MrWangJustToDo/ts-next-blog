import { LoginType } from "types/config";

let login: LoginType;

login = {
  username: {
    regexp: /^\w{2,7}$/,
    success: "格式正确",
    fail: "用户名为2-7个字符",
  },
  password: {
    regexp: /^\d{5,10}$/,
    success: "格式正确",
    fail: "密码为5-10个数字",
  },
};

export { login };
