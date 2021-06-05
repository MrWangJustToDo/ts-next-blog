import { Children, useCallback, useEffect, useState } from "react";
import { useShowAndHideAnimate } from "hook/useAnimate";
import { AnimationListType, AnimationItemType } from "types/components";

const AnimationItem: AnimationItemType = ({ children, showState, next, showClassName, nextIndex }) => {
  const { animateRef: ref } = useShowAndHideAnimate<HTMLDivElement>({
    state: showState,
    showDone: () => next(nextIndex),
    showClassName: showClassName || "lightSpeedInLeft",
  });

  return (
    <div ref={ref} style={{ display: "none" }}>
      {children}
    </div>
  );
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
