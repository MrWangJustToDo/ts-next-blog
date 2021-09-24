import { ClientActionType, CreateClientActionProps, CreateClientActionType } from "types/store";

const clientAction: ClientActionType = {
  SETDATALOADING: (name) => `setDataAction_client_${name}`,
  SETDATAACTION: (name) => `setDataAction_client_${name}`,
  SETDATASUCESS: (name) => `setDataSuccess_client_${name}`,
  SETDATAFAIL: (name) => `setDataFail_client_${name}`,
};

const setDataLoading_client: CreateClientActionType = ({ name }) => ({ type: clientAction.SETDATALOADING(name), loadingState: true });

const setDataAction_client: CreateClientActionType = ({ name }) => ({ type: clientAction.SETDATAACTION(name), loadingState: true });

const setDataSuccess_client: CreateClientActionType = <T>({ name, data }: CreateClientActionProps<T>) => ({
  type: clientAction.SETDATASUCESS(name),
  data,
  loadingState: false,
});

const setDataFail_client: CreateClientActionType = <T>({ name, error }: CreateClientActionProps<T>) => ({
  type: clientAction.SETDATAFAIL(name),
  error,
  loadingState: false,
});

export { clientAction, setDataLoading_client, setDataAction_client, setDataSuccess_client, setDataFail_client };
