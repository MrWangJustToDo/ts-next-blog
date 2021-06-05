import { useCallback, useRef, useState } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { UseBoolType, UseArrayType } from "types/hook";

const timeStep: number = 200;

const useBool: UseBoolType = (props = {}) => {
  const { init = false } = props;
  const boolState = useRef<boolean>(true);
  const [bool, setBool] = useState<boolean>(init);
  const boolRef = useRef<boolean>(init);
  boolRef.current = bool;
  const show = useCallback(() => setBool(true), []);
  const hide = useCallback(() => setBool(false), []);
  const switchBool = useCallback(() => setBool((last) => !last), []);
  const showThrottle = useCallback(
    throttle(() => setBool(true), timeStep, { leading: true }),
    []
  );
  const hideDebounce = useCallback(
    debounce(() => setBool(false), timeStep),
    []
  );
  const switchBoolDebounce = useCallback(
    debounce(() => setBool((last) => !last), timeStep),
    []
  );
  const showThrottleState = useCallback(
    throttle(
      () => {
        if (!boolRef.current && boolState.current) {
          setBool(true);
          boolState.current = false;
        }
      },
      timeStep,
      { leading: true }
    ),
    []
  );
  const hideDebounceState = useCallback(
    debounce(() => {
      if (boolRef.current && boolState.current) {
        setBool(false);
        boolState.current = false;
      }
    }, timeStep),
    []
  );
  return {
    bool,
    show,
    hide,
    boolState,
    switchBool,
    showThrottle,
    hideDebounce,
    switchBoolDebounce,
    showThrottleState,
    hideDebounceState,
  };
};

const useArray: UseArrayType = <T>(init: T[]) => {
  const [array, setArray] = useState<T[]>(init);
  const pushItem = useCallback<(props: T) => void>((val) => setArray((last) => (last.push(val), last)), []);
  const dropItem = useCallback<(props: T) => void>((val) => setArray((last) => last.filter((item) => item !== val)), []);
  const onlyOne = useCallback<(props: T) => void>((val) => setArray([val]), []);
  const switchItem = useCallback<(props: T) => void>((val) => {
    setArray((last) => {
      let newArray = Object.assign([], last);
      if (last.includes(val)) {
        newArray = newArray.filter((item) => item !== val);
      } else {
        newArray.push(val);
      }
      return newArray;
    });
  }, []);
  return [array, pushItem, dropItem, onlyOne, switchItem];
};

export { useBool, useArray };
