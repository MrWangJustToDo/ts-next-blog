import { MainLeft } from "./mainLeft";
import { MainRight } from "./mainRight";
import { animateFadeIn, getClass } from "utils/dom";
import { SimpleElement } from "types/components";

export const Main: SimpleElement = () => {
  return (
    <div className={getClass("row px-lg-4 px-sm-2", animateFadeIn)}>
      <MainLeft />
      <MainRight />
    </div>
  );
};
