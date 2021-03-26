import { ActionHandlerType, JudgeActionType, JudgeActioProps, LoadingActionProps, LoadingActionType } from "types/utils";

let actionHandler: ActionHandlerType;

let judgeAction: JudgeActionType;

let loadingAction: LoadingActionType;

actionHandler = (element, action, otherAction) => {
  if (element) {
    return action(element);
  } else if (otherAction) {
    return otherAction();
  } else {
    return Promise.resolve();
  }
};

const removeElements = (element: HTMLElement) => {
  actionHandler<HTMLCollection, void, void>(element.parentElement?.children, (eles) => {
    Array.from(eles).forEach((ele) => ele.localName === "span" && ele.hasAttribute("toast") && ele.remove());
  });
};

judgeAction = async <T extends HTMLElement>({
  element,
  judge,
  successClassName,
  successMessage,
  failClassName,
  failMessage,
  successCallback,
  failCallback,
}: JudgeActioProps<T>) => {
  const judgeResult = typeof judge === "function" ? await judge() : judge;
  removeElements(element);
  const span = document.createElement("span");
  span.setAttribute("toast", "true");
  if (judgeResult) {
    span.textContent = successMessage.current;
    const successClassNameArr = successClassName.split(" ");
    span.classList.add(...successClassNameArr);
    if (successCallback) {
      successCallback();
    }
  } else {
    if (typeof failMessage.current === "object") {
      span.textContent = failMessage.current?.current || "fail";
    } else {
      span.textContent = failMessage.current;
    }
    const failClassNameArr = failClassName.split(" ");
    span.classList.add(...failClassNameArr);
    if (failCallback) {
      failCallback();
    }
  }
  actionHandler<HTMLElement, void, void>(element.parentElement, (ele) => ele.appendChild(span));
};

loadingAction = <T extends HTMLElement>({ element, loadingClassName }: LoadingActionProps<T>) => {
  removeElements(element);
  const span = document.createElement("span");
  span.setAttribute("toast", "true");
  const loadingClassNameArr = loadingClassName.split(" ");
  span.classList.add(...loadingClassNameArr);
  actionHandler<T, void, void>(element, (ele) => ele.parentElement?.append(span));
};

const getScrollBarSize = () => {
  let cached = 0;
  const inner = document.createElement("div");
  inner.style.width = "100%";
  inner.style.height = "200px";

  const outer = document.createElement("div");
  const outerStyle = outer.style;

  outerStyle.position = "absolute";
  outerStyle.top = "0";
  outerStyle.left = "0";
  outerStyle.pointerEvents = "none";
  outerStyle.visibility = "hidden";
  outerStyle.width = "200px";
  outerStyle.height = "150px";
  outerStyle.overflow = "hidden";

  outer.appendChild(inner);

  document.body.appendChild(outer);

  const widthContained = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  cached = widthContained - widthScroll;

  return cached;
};

export { actionHandler, judgeAction, loadingAction, getScrollBarSize };
