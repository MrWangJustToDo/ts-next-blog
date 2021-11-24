import { MainLeft } from "./mainLeft";
import { MainRight } from "./mainRight";
import { SimpleElement } from "types/components";

export const Main: SimpleElement = () => {
  return (
    <div className={"row px-lg-4 px-sm-2"}>
      <MainLeft />
      <MainRight />
    </div>
  );
};
