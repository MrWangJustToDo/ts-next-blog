import { log } from "./log";
import { parseToString } from "./data";
import { cancel, delay } from "./delay";

const maxTimeStore = 1000 * 60 * 10;

class Cache<T, K> {
  constructor(readonly maxTime: number = maxTimeStore, readonly store: Map<T, K> = new Map()) {
    if (!store.has || !store.set || !store.delete || !store.get) {
      throw new Error(`store must is a Map or List. store: ${store}`);
    }
  }

  set = (key: T, value: K, time: number = this.maxTime) => {
    if (value === undefined) {
      log(`can not store undefined value! key: ${parseToString(key)}`, "error");
      return;
    }
    if (this.store.has(key)) {
      log(
        `already cache, now cache again! key: ${parseToString(key)} oldValue: ${parseToString(this.store.get(key)!)} newValue: ${parseToString(value)}`,
        "warn"
      );
      if (typeof key === "string") {
        log(`cancel auto delete, key：${key}`, "warn");
        cancel(key);
      }
    }
    this.store.set(key, value);
    this.delete(key, time);
  };

  delete = (key: T, time: number = this.maxTime) => {
    delay(
      time,
      () => {
        if (this.store.has(key)) {
          log(`start delete data from cache, next request will update this data. key: ${key}`, "normal");
          this.store.delete(key);
        } else {
          log(`error, nothing need to delete. key: ${key}`, "error");
        }
      },
      typeof key === "string" ? key : undefined
    );
  };

  get = (key: T) => {
    if (this.store.has(key)) {
      return this.store.get(key);
    } else {
      log(`warn, not cache yet, nothing to return. key: ${key}`, "warn");
      return false;
    }
  };

  deleteRightNow = (key: T) => {
    if (this.store.has(key)) {
      if (typeof key === "string") {
        cancel(key);
      }
      this.store.delete(key);
      log(`force delete data from cache. key: ${key}`, "warn");
      return;
    }
    if (typeof key === "string") {
      let newKey = key as string;
      if (!newKey.startsWith("/")) {
        newKey = "/" + newKey;
      }
      if (this.store.has(newKey as any)) {
        cancel(newKey);
        this.store.delete(newKey as any);
        log(`force delete data from cache. newKey: ${newKey}`, "warn");
        return;
      }
      if (!newKey.startsWith("/api")) {
        newKey = "/api" + newKey;
      }
      if (this.store.has(newKey as any)) {
        cancel(newKey);
        this.store.delete(newKey as any);
        log(`force delete data from cache. newKey: ${newKey}`, "warn");
        return;
      }
    }
    log(`error, nothing need to delete. key: ${key}, typeOf key: ${typeof key}`, "error");
  };
}

export { Cache };
