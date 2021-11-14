import { call, put } from "redux-saga/effects";
import { apiName } from "config/api";
import { createRequest } from "utils/fetcher";
import { getDataFail_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

export function* getTagData() {
  try {
    let { code, state, data } = yield call((apiName: apiName) => createRequest({ header: { apiToken: true }, apiPath: apiName }).run(), apiName.tag);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.tag, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.tag, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.tag, data: (e as Error).toString() }));
  }
}
