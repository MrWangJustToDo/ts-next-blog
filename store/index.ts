import createSagaMiddleware from "redux-saga";
import { legacy_createStore as createStore, applyMiddleware, compose } from "redux";
import { MakeStore, createWrapper } from "next-redux-wrapper";
import { rootReducer } from "./reducer";
import { rootSaga } from "./saga";
import type { SagaStore } from "./type";
import { SagaManager } from "./saga/util";

export const makeStore: MakeStore<SagaStore> = () => {
  const devtools =
    typeof window !== "undefined" &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsDenylist: [] });

  const composeEnhancers = devtools || compose;

  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Add an extra parameter for applying middleware:
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware))) as SagaStore;

  // 3: Run your sagas on server
  store.sagaTask = SagaManager.startSagas(rootSaga, sagaMiddleware);

  // 4: now return the store:
  return store;
};

export const wrapper = createWrapper<SagaStore>(makeStore, { debug: false });
