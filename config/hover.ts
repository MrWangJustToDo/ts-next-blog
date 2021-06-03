// hover 显示信息的图标以及相关信息
import { GetUserPropsProps, GetUserStateProps } from "types/config";

const propsArray = ["gender", "qq", "email", "address"];
const propsIconArray = [["ri-men-line", "ri-women-line"], "ri-qq-line", "ri-mail-line", "ri-user-location-line"];
const stateArray = ["collect", "assent", "publish"];
const stateIconArray = ["ri-star-line text-primary", "ri-thumb-up-line text-success", "ri-article-line text-info"];

const getUserProps = (props: GetUserPropsProps): Array<{ key: any; icon: string; value: string }> => {
  const re: { key: any; icon: string; value: string }[] = [];
  propsArray.forEach((item, index) => {
    if (props[item] !== undefined) {
      const currentProps: { [props: string]: any } = { key: index };
      if (item === "gender") {
        currentProps["icon"] = propsIconArray[index][props[item]!];
        currentProps["value"] = props[item] === 0 ? "男" : "女";
      } else {
        currentProps["icon"] = propsIconArray[index];
        currentProps["value"] = props[item];
      }
      re.push(currentProps as { key: any; icon: string; value: string });
    }
  });
  return re;
};

const getUserState = (props: GetUserStateProps): Array<{ key: any; icon: string; value: number }> => {
  const re: { key: any; icon: string; value: number }[] = [];
  stateArray.forEach((item, index) => {
    if (props[item] !== undefined) {
      const currentState: { [props: string]: any } = { key: index };
      currentState["icon"] = stateIconArray[index];
      currentState["value"] = props[item];
      re.push(currentState as { key: any; icon: string; value: number });
    }
  });
  return re;
};

export { getUserProps, getUserState };
