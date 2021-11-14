import { CreateServerActionProps, CreateServerActionType, ServerActionType } from "./type";

const serverAction: ServerActionType = {
  GETDATALOADING: (name) => `getDataLoading_server_${name}`,
  GETDATAACTION: (name) => `getDataAction_server_${name}`,
  GETDATASUCESS: (name) => `getDataSuccess_server_${name}`,
  GETDATAFAIL: (name) => `getDataFail_server_${name}`,
};

const getDataLoading_server: CreateServerActionType = ({ name }) => ({ type: serverAction.GETDATALOADING(name), loadingState: true });

const getDataAction_Server: CreateServerActionType = ({ name }) => ({ type: serverAction.GETDATAACTION(name), loadingState: true });

const getDataSuccess_Server: CreateServerActionType = <T>({ name, data }: CreateServerActionProps<T>) => ({
  type: serverAction.GETDATASUCESS(name),
  data,
  loadingState: false,
});

const getDataFail_Server: CreateServerActionType = <T>({ name, error }: CreateServerActionProps<T>) => ({
  type: serverAction.GETDATAFAIL(name),
  error,
  loadingState: false,
});

export { serverAction, getDataLoading_server, getDataAction_Server, getDataSuccess_Server, getDataFail_Server };
