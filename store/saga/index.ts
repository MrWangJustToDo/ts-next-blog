import { apiName } from "config/api";
import { all, takeLatest } from "redux-saga/effects";
import { serverAction } from "store/reducer/server/action";
import sagaConfig from "./config";

function* rootSaga() {
  yield all(Object.keys(sagaConfig).map((it) => takeLatest(serverAction.GETDATAACTION(it as apiName), sagaConfig[it])));
}

export default rootSaga;
