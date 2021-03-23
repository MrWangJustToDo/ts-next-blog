// 类名自动处理函数

import { GetArray, GetClass, GetItem, TransformArray } from "types/utils";

let transformArray: TransformArray;
let getClass: GetClass;
let animateFadein: GetArray<string>;
let animateFadeout: GetArray<string>;
let animateZoomin: GetArray<string>;
let animateZoomout: GetArray<string>;
let flexCenter: GetItem<string>;
let flexStart: GetItem<string>;
let flexEnd: GetItem<string>;
let flexBetween: GetItem<string>;
let flexAround: GetItem<string>;
let flexBottom: GetItem<string>;

// 自动处理数组
transformArray = (arr) =>
  arr.reduce<string[]>((pre, current) => {
    if (Array.isArray(current)) {
      return pre.concat(transformArray(current));
    }
    if (typeof current === "function") {
      let re = current();
      if (Array.isArray(re)) {
        return pre.concat(transformArray(re));
      } else {
        return pre.concat(transformArray([re]));
      }
    }
    if (typeof current === "string") {
      if (current.length > 0) {
        pre.push(current);
      }
      return pre;
    }
    console.error("className type error: ", current);
    return pre;
  }, []);

// 自动处理类名
getClass = (...res) => transformArray(res).join(" ");

// animate
animateFadein = () => ["animate__animated", "animate__fadeIn", "animate__faster"];
animateFadeout = () => ["animate__animated", "animate__fadeOut", "animate__faster"];
animateZoomin = () => ["animate__animated", "animate__zoomIn", "animate__faster"];
animateZoomout = () => ["animate__animated", "animate__zoomOut", "animate__faster"];

// flex
flexCenter = () => "d-flex justify-content-center align-items-center";
flexStart = () => "d-flex justify-content-start align-items-center";
flexEnd = () => "d-flex justify-content-end align-items-center";
flexBetween = () => "d-flex justify-content-between align-items-center";
flexAround = () => "d-flex justify-content-around align-items-center";
flexBottom = () => "d-flex justify-content-center align-items-end";

export { getClass, animateFadein, animateZoomin, animateFadeout, animateZoomout, flexCenter, flexStart, flexEnd, flexBetween, flexAround, flexBottom };
