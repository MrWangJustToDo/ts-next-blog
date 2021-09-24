import { mainRight } from "config/home";
import MainRightType from "./mainRightType";
import MainRightTag from "./mainRightTag";
import MainRightCommend from "./mainRightCommend";
import { SimpleElement } from "types/components";

const MainRight: SimpleElement = () => {
  return (
    <div className="col-md-4 user-select-none">
      <MainRightType index={mainRight.type} />
      <MainRightTag index={mainRight.tag} />
      <MainRightCommend index={mainRight.recommend} />
    </div>
  );
};

export default MainRight;
