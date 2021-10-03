import { RefObject, useState, useEffect } from "react";

const useInViewport = <T extends HTMLElement>({ ref, getElement }: { ref?: RefObject<T>; getElement?: () => T }) => {
  const [inViewPort, setInViewport] = useState<boolean>(false);
  useEffect(() => {
    const el = ref ? ref.current : getElement ? getElement() : null;
    if (!el) {
      return () => {};
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInViewport(true);
        } else {
          setInViewport(false);
        }
      }
    });

    observer.observe(el as HTMLElement);

    return () => {
      observer.disconnect();
    };
  }, [ref, getElement]);

  return inViewPort;
};

export { useInViewport };
