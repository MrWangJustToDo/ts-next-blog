import { useCallback, useState } from "react";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { cancel, delay } from "utils/delay";
import { UseBoolType, UseArrayType } from "types/hook";

const timeStep: number = 200;

const useBool: UseBoolType = (props = {}) => {
  const { init = false, stateChangeTimeStep = 400, key = "useBool" } = props;
  const [bool, setBool] = useState<boolean>(init);
  const [boolState, setBoolState] = useState<boolean>(true);
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
  const switchBoolThrottle = useCallback(
    throttle(() => setBool((last) => !last), timeStep, { leading: true }),
    []
  );
  const showState = useCallback(() => {
    if (boolState) {
      setBool(true);
      setBoolState(false);
      cancel(key);
      delay(stateChangeTimeStep, () => setBoolState(true), key);
    }
  }, [boolState, key]);
  const hideDebounceNoState = useCallback(
    debounce(() => {
      setBool(false);
      if (boolState) {
        setBoolState(false);
        cancel(key);
        delay(stateChangeTimeStep, () => setBoolState(true), key);
      }
    }, timeStep),
    [boolState, key]
  );
  const hideDebounceState = useCallback(
    debounce(() => {
      if (boolState) {
        setBool(false);
        setBoolState(false);
        cancel(key);
        delay(stateChangeTimeStep, () => setBoolState(true), key);
      }
    }, timeStep),
    [boolState, key]
  );
  const switchBoolState = useCallback(() => {
    if (boolState) {
      setBoolState(false);
      setBool((last) => !last);
      delay(stateChangeTimeStep, () => setBoolState(true));
    }
  }, [boolState]);
  return {
    bool,
    boolState,
    show,
    hide,
    switchBool,
    showThrottle,
    hideDebounce,
    switchBoolThrottle,
    showState,
    hideDebounceState,
    switchBoolState,
    hideDebounceNoState,
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
