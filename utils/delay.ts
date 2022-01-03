import { log } from "./log";
import { Cancel, Delay, KeyMap, RejectMap, TimeoutMap } from "types/utils";

const timeoutMap: TimeoutMap = {};
const rejectMap: RejectMap = {};
const keyMap: KeyMap = {};
let keyLength = 0;
const maxKeyLength = 200;

const cancel: Cancel = (key) => {
  if (timeoutMap[key]) {
    const length = timeoutMap[key].length;
    timeoutMap[key] = timeoutMap[key].map((id) => id && clearTimeout(id)).slice(length);
    rejectMap[key] = rejectMap[key].map((reject) => reject && reject()).slice(length);
  }
  if (keyLength > maxKeyLength) {
    const keys = Object.keys(keyMap).sort((key1, key2) => (keyMap[key1] > keyMap[key2] ? 1 : -1));
    log(`start delete delay key, currentLength ${keyLength} over max length ${maxKeyLength}`, "normal");
    for (let keyItem of keys) {
      if (keyItem !== key && !rejectMap[keyItem].length) {
        delete keyMap[keyItem];
        delete timeoutMap[keyItem];
        delete rejectMap[keyItem];
        keyLength--;
      }
    }
  }
};

const delay: Delay = (time, action, key) => {
  if (key === undefined) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    }).then(() => action && action());
  } else {
    if (!(key in keyMap)) {
      keyMap[key] = 1;
      timeoutMap[key] = [];
      rejectMap[key] = [];
      keyLength++;
    } else {
      keyMap[key]++;
    }
    cancel(key);
    return new Promise<void>((resolve, reject) => {
      rejectMap[key].push(reject);
      timeoutMap[key].push(
        setTimeout(() => {
          resolve();
        }, time)
      );
    })
      .then(() => action && action())
      .catch(() => {});
  }
};

export { delay, cancel };
