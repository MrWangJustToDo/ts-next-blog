import MainLeft from "./mainLeft";
import MainRight from "./mainRight";
import { animateFadein, getClass } from "utils/dom";
import { SimpleElement } from "types/components";

const Main: SimpleElement = () => {
  return (
    <div className={getClass("row px-lg-4 px-sm-2", animateFadein)}>
      <MainLeft />
      <MainRight />
    </div>
  );
};

export default Main;
