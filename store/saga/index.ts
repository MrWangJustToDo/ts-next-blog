import { apiName } from "config/api";
import { all, takeLatest } from "redux-saga/effects";
import { serverAction } from "store/reducer/server/share/action";
import { getHomeData, getTagData, getTypeData, getBlogData } from "./action";

function* rootSaga() {
  yield all([
    takeLatest(serverAction.GETDATAACTION(apiName.home), getHomeData),
    takeLatest(serverAction.GETDATAACTION(apiName.tag), getTagData),
    takeLatest(serverAction.GETDATAACTION(apiName.type), getTypeData),
    takeLatest(serverAction.GETDATAACTION(apiName.blog), getBlogData),
  ]);
}

export { rootSaga };
