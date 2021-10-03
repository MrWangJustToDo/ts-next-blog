import React, { Children, Component, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { findDOMNode } from "react-dom";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { AnimationListType, AnimationItemType } from "types/components";

class Empty extends Component {
  render() {
    const { children } = this.props;
    return children;
  }
}

const useGetElement = <T extends HTMLElement>(element: JSX.Element): [e: JSX.Element, g: () => T] => {
  const ref = useRef<T>();
  const currentElement = useMemo(() => React.cloneElement(<Empty>{element}</Empty>, { ref }), [element]);
  const getElement = useCallback(() => findDOMNode(ref.current) as T, []);
  return [currentElement, getElement];
};

const AnimationItem: AnimationItemType = ({ children, showState, showDone, showClassName, hideClassName, hideDone, faster }) => {
  const [currentChildren, getElement] = useGetElement<HTMLElement>(children as JSX.Element);

  useShowAndHideAnimate({
    mode: "opacity",
    state: Boolean(showState),
    faster,
    getElement,
    showDone,
    hideDone,
    hideClassName: hideClassName || "lightSpeedOutLeft",
    showClassName: showClassName || "lightSpeedInLeft",
  });

  return <>{currentChildren}</>;
};

const AnimationList: AnimationListType = ({ children, showClassName }) => {
  const [show, setShow] = useState<boolean[]>(
    Array(Children.count(children))
      .fill(0)
      .map((_, i) => (i === 0 ? true : false))
  );
  const showItem = useCallback(
    (i) =>
      setShow((last) => {
        if (i < last.length) {
          const newArray = [...last];
          newArray[i] = true;
          return newArray;
        } else {
          return last;
        }
      }),
    []
  );

  useEffect(() => {
    setShow((last) => {
      const newLength = Children.count(children);
      if (newLength === last.length) {
        return last;
      } else if (newLength < last.length) {
        return [...last].slice(0, newLength);
      } else {
        const newArray = Object.assign([], last);
        newArray.push(
          ...Array(newLength - last.length)
            .fill(0)
            .map((_, i) => (((last.length && last[last.length - 1]) || !last.length) && i === 0 ? true : false))
        );
        return newArray;
      }
    });
  }, [children.length]);

  return (
    <>
      {Children.map(children, (child, index) => {
        return child && typeof child === "object" ? (
          <AnimationItem key={(child as any).key || index} showState={show[index]} showDone={() => showItem(index + 1)} showClassName={showClassName}>
            {child}
          </AnimationItem>
        ) : (
          child
        );
      })}
    </>
  );
};

export { AnimationList, AnimationItem, useGetElement };
