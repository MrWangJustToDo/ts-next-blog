import { BarType } from "types/components";

const Bar: BarType = ({ forwardRef }) => <div id="loadingBar" ref={forwardRef} className="position-fixed w-100 bg-info"></div>;

export default Bar;
