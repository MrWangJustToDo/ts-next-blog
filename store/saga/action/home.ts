import { call, put, select } from "redux-saga/effects";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { createRequest } from "utils/fetcher";
import { StoreState } from "store/type";
import { getDataFail_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

export function* getHomeData() {
  const apiToken: string = yield select((state: StoreState) => state.client[actionName.currentToken].data);
  try {
    let { code, state, data } = yield call((apiName: apiName) => createRequest({ header: { apiToken }, apiPath: apiName }).run(), apiName.home);
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.home, data }));
    } else {
      yield put(getDataFail_Server({ name: apiName.home, data: state }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.home, data: (e as Error).toString() }));
  }
}
