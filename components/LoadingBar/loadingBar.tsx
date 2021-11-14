import { BarType } from "types/components";

export const Bar: BarType = ({ forwardRef }) => (
  <div id="loadingBar">
    <div ref={forwardRef} className="position-fixed w-100 bg-danger" />
  </div>
);
