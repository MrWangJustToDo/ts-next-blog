import { call, put, select } from "redux-saga/effects";
import { State } from "store";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { createRequest } from "utils/fetcher";
import { getDataSucess_Server, getDataFail_Server } from "store/reducer/server/action";

export function* getTagData() {
  const apiToken: ReturnType<(props: State) => string> = yield select((state) => state.client[actionName.currentToken].data);
  try {
    let { code, state, data } = yield call(createRequest({ header: { apiToken } }).run, apiName.tag);
    if (code === 0) {
      yield put(getDataSucess_Server({ name: apiName.tag, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.tag, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.tag, data: e.toString() }));
  }
}
