import { call, put } from "redux-saga/effects";
import { apiName } from "config/api";
import { createRequest } from "utils/fetcher";
import { getDataFail_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

export function* getTypeData() {
  try {
    let { code, state, data } = yield call((apiName: apiName) => createRequest({ header: { apiToken: true }, apiPath: apiName }).run(), apiName.type);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.type, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.type, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.type, data: (e as Error).toString() }));
  }
}
