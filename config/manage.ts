import { AddModuleType } from "types/config";

const addModule: AddModuleType = {
  input: {
    regexp: /^[^\s]{2,7}$/,
    success: "格式正确",
    fail: "输入应为2-7个字符",
  },
};

const manageLength = 4;

export { addModule, manageLength };
