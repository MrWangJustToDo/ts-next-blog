import { mainRight } from "config/home";
import { AnimationItem } from "components/AnimationList";
import { MainRightType } from "./mainRightType";
import { MainRightTag } from "./mainRightTag";
import { MainRightCommend } from "./mainRightCommend";
import { SimpleElement } from "types/components";

export const MainRight: SimpleElement = () => {
  return (
    <AnimationItem showState={true} showClassName="rubberBand" faster={false}>
      <div className="col-md-4 user-select-none">
        <MainRightType index={mainRight.type} />
        <MainRightTag index={mainRight.tag} />
        <MainRightCommend index={mainRight.recommend} />
      </div>
    </AnimationItem>
  );
};
