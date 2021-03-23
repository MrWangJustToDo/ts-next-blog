import { AddModuleType } from "types/config";

let addModule: AddModuleType;

let manageLength: number;

addModule = {
  input: {
    regexp: /^[^\s]{2,7}$/,
    success: "格式正确",
    fail: "输入应为2-7个字符",
  },
};

manageLength = 4;

export { addModule, manageLength };
