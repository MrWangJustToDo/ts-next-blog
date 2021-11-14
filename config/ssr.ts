import { actionName } from "config/action";
import { setDataSuccess_client } from "store/reducer/client/share/action";
import { AutoDispatchTokenHandler, AutoDispatchTokenHandlerProps } from "types/config";

const autoDispatchTokenHandler: AutoDispatchTokenHandler = (action) => {
  return (store) =>
    async ({ req, res, ...etc }: AutoDispatchTokenHandlerProps) => {
      if (store.getState().client[actionName.currentToken].data !== req.session["apiToken"]) {
        store.dispatch(setDataSuccess_client({ name: actionName.currentToken, data: req.session["apiToken"] }));
      }
      return await action({ store, req, res, ...etc });
    };
};

export { autoDispatchTokenHandler };
