import { CreateServerActionProps, CreateServerActionType, ServerActionType } from "./type";

const serverAction: ServerActionType = {
  GET_DATA_LOADING: (name) => `getDataLoading_server_${name}`,
  GET_DATA_ACTION: (name) => `getDataAction_server_${name}`,
  GET_DATA_SUCCESS: (name) => `getDataSuccess_server_${name}`,
  GET_DATA_FAIL: (name) => `getDataFail_server_${name}`,
};

const getDataLoading_server: CreateServerActionType = ({ name }) => ({ type: serverAction.GET_DATA_LOADING(name), loadingState: true });

const getDataAction_Server: CreateServerActionType = ({ name }) => ({ type: serverAction.GET_DATA_ACTION(name), loadingState: true });

const getDataSuccess_Server: CreateServerActionType = <T>({ name, data }: CreateServerActionProps<T>) => ({
  type: serverAction.GET_DATA_SUCCESS(name),
  data,
  loadingState: false,
});

const getDataFail_Server: CreateServerActionType = <T>({ name, error }: CreateServerActionProps<T>) => ({
  type: serverAction.GET_DATA_FAIL(name),
  error,
  loadingState: false,
});

export { serverAction, getDataLoading_server, getDataAction_Server, getDataSuccess_Server, getDataFail_Server };
