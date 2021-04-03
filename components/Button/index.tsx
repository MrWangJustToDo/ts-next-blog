import { useCallback } from "react";
import Loading from "components/Loading";
import { useBool } from "hook/useData";
import { flexCenter, getClass } from "utils/class";
import { ButtonType } from "types/components";

let Button: ButtonType;

Button = ({ request, type = "button", disable = false, value = "确定", initState = true, className = "", style = {}, loadingColor }) => {
  const { bool, show, hide } = useBool({ init: initState });

  const requestCallback = useCallback(() => {
    hide();
    request().then(show).catch(show);
  }, [request]);
  
  return (
    <button
      className={getClass("btn position-relative", flexCenter, className)}
      disabled={!bool || disable}
      style={style}
      onClick={requestCallback}
      title={bool ? value : "loading"}
      type={type}
      data-enable={bool}
    >
      <span style={{ color: bool ? "inherit" : "transparent" }}>{value}</span>
      {!bool && <Loading className="position-absolute" _style={{ width: "15px", height: "15px" }} color={loadingColor} />}
    </button>
  );
};

export default Button;
