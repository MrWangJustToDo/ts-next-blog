import { useEffect } from "react";
import { BarType } from "types/components";

const Bar: BarType = ({ height = 1.5, present = 0, loading = false, autoAdd }) => {
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (loading) {
      id = autoAdd();
    }
    return () => clearInterval(id);
  }, [loading]);

  return (
    <div
      className="position-fixed w-100 bg-info"
      style={{
        zIndex: 1,
        top: 0,
        height: `${height}px`,
        transformOrigin: `0 0`,
        transform: `scale(${present / 100}, 1)`,
        filter: `drop-shadow(2px 2px 2px rgba(200, 200, 200, 0.4))`,
      }}
    ></div>
  );
};

export default Bar;
