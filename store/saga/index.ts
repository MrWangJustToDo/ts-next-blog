import { apiName } from "config/api";
import { all, takeLatest } from "redux-saga/effects";
import { serverAction } from "store/reducer/server/share/action";
import { getHomeData, getTagData, getTypeData, getBlogData } from "./action";

function* rootSaga() {
  yield all([
    takeLatest(serverAction.GET_DATA_ACTION(apiName.home), getHomeData),
    takeLatest(serverAction.GET_DATA_ACTION(apiName.tag), getTagData),
    takeLatest(serverAction.GET_DATA_ACTION(apiName.type), getTypeData),
    takeLatest(serverAction.GET_DATA_ACTION(apiName.blog), getBlogData),
  ]);
}

export { rootSaga };
