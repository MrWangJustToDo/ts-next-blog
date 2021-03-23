import { call, put, select } from "redux-saga/effects";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { createRequest } from "utils/fetcher";
import { getDataSucess_Server, getDataFail_Server } from "store/reducer/server/action";
import { State } from "store";

export function* getTypeData() {
  const apiToken: ReturnType<(props: State) => string> = yield select((state) => state.client[actionName.currentToken].data);
  try {
    let { code, state, data } = yield call(createRequest({ header: { apiToken } }).run, apiName.type);
    if (code === 0) {
      yield put(getDataSucess_Server({ name: apiName.type, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.type, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.type, data: e.toString() }));
  }
}
