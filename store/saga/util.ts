import { fork, take, cancel } from "redux-saga/effects";

import type { rootSaga } from ".";
import type createSagaMiddleware from "@redux-saga/core";
import type { Saga, Task } from "@redux-saga/types";
import type { SagaStore } from "../type";

export const CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR";

function createAbortAbleSaga(saga: typeof rootSaga) {
  if (process.env.NODE_ENV === "development") {
    return function* main() {
      const sagaTask: Task = yield fork(saga);

      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  } else {
    return saga;
  }
}

const SagaManager = {
  startSagas(saga: typeof rootSaga, sagaMiddleware: ReturnType<typeof createSagaMiddleware>) {
    return sagaMiddleware.run(createAbortAbleSaga(saga) as Saga);
  },

  cancelSagas(store: SagaStore) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR,
    });
  },
};

export { SagaManager };
