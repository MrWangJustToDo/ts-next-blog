import MainLeftHead from "./mainLeftHead";
import MainLeftFoot from "./mainLeftFoot";
import MainLeftContent from "./mainLeftContent";
import { SimpleElement } from "types/components";

const MainLeft: SimpleElement = () => {
  return (
    <div className="col-md-8 user-select-none">
      <div className="card">
        <MainLeftHead />
        <MainLeftContent />
        <MainLeftFoot />
      </div>
    </div>
  );
};

export default MainLeft;
