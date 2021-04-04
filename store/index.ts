import createSagaMiddleware, { Task } from "redux-saga";
import { createStore, applyMiddleware, compose, Store } from "redux";
import { MakeStore, createWrapper } from "next-redux-wrapper";
import rootReducer from "./reducer";
import rootSaga from "./saga";

// redux采用服务器端与客户端分离的方式

export interface State {
  server: { [props: string]: any };
  client: { [props: string]: any };
}

export interface SagaStore extends Store {
  sagaTask?: Task;
}

export const makeStore: MakeStore<State> = () => {
  const devtools =
    typeof window !== "undefined" &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ === "function" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ actionsBlacklist: [] });

  const composeEnhancers = devtools || compose;

  // 1: Create the middleware
  const sagaMiddleware = createSagaMiddleware();

  // 2: Add an extra parameter for applying middleware:
  const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  // 3: Run your sagas on server
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);

  // 4: now return the store:
  return store;
};

export const wrapper = createWrapper<State>(makeStore, { debug: false });
