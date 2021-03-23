import { actionName } from "config/action";
import { setDataSucess_client } from "store/reducer/client/action";
import { AutoDispatchTockenHandler, AutoDispatchTockenHandlerProps } from "types/config";

let autoDispatchTockenHandler: AutoDispatchTockenHandler;

autoDispatchTockenHandler = (action) => {
  return async ({ store, req, res, ...etc }: AutoDispatchTockenHandlerProps) => {
    if (store.getState().client[actionName.currentToken].data !== req.session["apiToken"]) {
      store.dispatch(setDataSucess_client({ name: actionName.currentToken, data: req.session["apiToken"] }));
    }
    return await action({ store, req, res, ...etc });
  };
};

export { autoDispatchTockenHandler };
