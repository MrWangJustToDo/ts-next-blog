import { call, put, select } from "redux-saga/effects";
import { apiName } from "config/api";
import { actionName } from "config/action";
import { createRequest } from "utils/fetcher";
import { StoreState } from "store/type";
import { getDataFail_Server, getDataSuccess_Server } from "store/reducer/server/share/action";

export function* getBlogData() {
  const state: StoreState = yield select<(state: StoreState) => StoreState>((state) => state);
  const apiToken = state.client[actionName.currentToken]["data"];
  const id = state.client[actionName.currentBlogId]["data"];
  try {
    let { code, state, data } = yield call(
      (apiName: apiName) => createRequest({ header: { apiToken }, query: { blogId: id }, apiPath: apiName }).run(),
      apiName.blog
    );
    if (code === 0) {
      yield put(getDataSuccess_Server({ name: apiName.blog, data: { [id]: data } }));
    } else {
      yield put(getDataFail_Server({ name: apiName.blog, data: { [id]: state } }));
    }
  } catch (e) {
    yield put(getDataFail_Server({ name: apiName.blog, data: { [id]: (e as Error).toString() } }));
  }
}
