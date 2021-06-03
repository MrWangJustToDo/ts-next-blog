import { GetArray, GetClass, GetItem, TransformArray, AnimateCSSType, HandleClassActionType } from "types/utils";

// 自动处理数组
const transformArray: TransformArray = (arr) =>
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
const getClass: GetClass = (...res) => transformArray(res).join(" ");

// animate
const animateFadein: GetArray<string> = () => ["animate__animated", "animate__fadeIn", "animate__faster"];
const animateFadeout: GetArray<string> = () => ["animate__animated", "animate__fadeOut", "animate__faster"];
const animateZoomin: GetArray<string> = () => ["animate__animated", "animate__zoomIn", "animate__faster"];
const animateZoomout: GetArray<string> = () => ["animate__animated", "animate__zoomOut", "animate__faster"];

// flex
const flexCenter: GetItem<string> = () => "d-flex justify-content-center align-items-center";
const flexStart: GetItem<string> = () => "d-flex justify-content-start align-items-center";
const flexEnd: GetItem<string> = () => "d-flex justify-content-end align-items-center";
const flexBetween: GetItem<string> = () => "d-flex justify-content-between align-items-center";
const flexAround: GetItem<string> = () => "d-flex justify-content-around align-items-center";
const flexBottom: GetItem<string> = () => "d-flex justify-content-center align-items-end";

const animateCSS: AnimateCSSType = ({ element, animation, prefix = "animate__" }) =>
  new Promise((resolve) => {
    const classNames = [`${prefix}animated`, `${prefix}faster`, `${prefix}${animation}`];

    handleCssAction({ element, classNames, type: "add" });

    function handleAnimationEnd(event: Event) {
      event.stopPropagation();
      handleCssAction({ element, classNames, type: "remove" });
      resolve();
    }

    element.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

const handleCssAction: HandleClassActionType = ({ element, classNames, type }) => {
  if (type === "add") {
    element.classList.add(...classNames.filter(Boolean));
  } else {
    element.classList.remove(...classNames.filter(Boolean));
  }
};

export {
  getClass,
  animateFadein,
  animateZoomin,
  animateFadeout,
  animateZoomout,
  flexCenter,
  flexStart,
  flexEnd,
  flexBetween,
  flexAround,
  flexBottom,
  animateCSS,
  handleCssAction,
};
