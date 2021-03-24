import { call, put } from "redux-saga/effects";
import { apiName } from "config/api";
import { createRequest } from "utils/fetcher";
import { getDataSucess_Server, getDataFail_Server } from "store/reducer/server/action";

export function* getTypeData() {
  try {
    let { code, state, data } = yield call(createRequest({ header: { apiToken: true } }).run, apiName.type);
    if (code === 0) {
      yield put(getDataSucess_Server({ name: apiName.type, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.type, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.type, data: e.toString() }));
  }
}
