import { mainRight } from "config/hoom";
import MainRightType from "./mainRightType";
import MainRightTag from "./mainRightTag";
import MainRightCommend from "./mainRightCommend";
import { SimpleElement } from "types/components";

let MainRight: SimpleElement;

MainRight = () => {
  return (
    <div className="col-md-4 user-select-none">
      <MainRightType index={mainRight.type} />
      <MainRightTag index={mainRight.tag} />
      <MainRightCommend index={mainRight.recommend} />
    </div>
  );
};

export default MainRight;
