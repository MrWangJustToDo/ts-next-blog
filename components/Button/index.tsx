import { useCallback } from "react";
import Loading from "components/Loading";
import { useBool } from "hook/useData";
import { flexCenter, getClass } from "utils/dom";
import { ButtonType } from "types/components";

const Button: ButtonType = ({
  request,
  type = "button",
  disable = false,
  value = "确定",
  initState = true,
  loading = false,
  className = "",
  _style,
  loadingColor,
  children,
}) => {
  const { bool, show, hide } = useBool({ init: initState });

  const requestCallback = useCallback(() => {
    if (request) {
      hide();
      Promise.resolve().then(request).then(show).catch(show);
    }
  }, [request]);

  return (
    <button
      className={getClass("btn position-relative", flexCenter, className)}
      disabled={!bool || disable || loading}
      style={_style}
      onClick={requestCallback}
      title={bool || !loading ? value : "loading"}
      type={type}
      data-enable={bool || !loading}
    >
      <span style={{ color: bool || !loading ? "inherit" : "transparent" }}>{value ? value : children}</span>
      {(!bool || loading) && <Loading className="position-absolute" _style={{ width: "15px", height: "15px" }} color={loadingColor} />}
    </button>
  );
};

export default Button;
