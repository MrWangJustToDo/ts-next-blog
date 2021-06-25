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

const AnimationItem: AnimationItemType = ({ children, showState, next, showClassName, nextIndex }) => {
  const ref = useRef<HTMLDivElement>(null);

  const [currentRef, currentChildren] = useMemo(() => {
    return [ref, React.cloneElement(<Empty>{children}</Empty>, { ref })];
  }, [children]);

  const getElement = useCallback(() => findDOMNode(currentRef.current) as HTMLElement, []);

  useEffect(() => {
    const ele = getElement();
    if (ele) {
      (ele as HTMLElement).style.opacity = "0";
    }
  }, [getElement]);

  useShowAndHideAnimate({
    mode: "opacity",
    getElement,
    state: showState,
    showDone: () => next(nextIndex),
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
  }, [children]);

  return (
    <>
      {Children.map(children, (child, index) => {
        return child && typeof child === "object" ? (
          <AnimationItem key={(child as any).key || index} showState={show[index]} next={showItem} nextIndex={index + 1} showClassName={showClassName}>
            {child}
          </AnimationItem>
        ) : (
          child
        );
      })}
    </>
  );
};

export default AnimationList;
