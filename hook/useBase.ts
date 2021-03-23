import { State } from "store";
import { useDispatch, useSelector } from "react-redux";
import { UseCurrentStateType } from "types/hook";

let useCurrentState: UseCurrentStateType;

useCurrentState = () => {
  const dispatch = useDispatch();
  const state = useSelector<State, State>((state) => state);
  return { state, dispatch };
};

export { useCurrentState };
