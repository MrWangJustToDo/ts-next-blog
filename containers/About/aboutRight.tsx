import AboutRightLink from "./aboutRightLink";
import AboutRightAbout from "./aboutRightAbout";
import { SimpleElement } from "types/components";

const AboutRight: SimpleElement = () => {
  return (
    <div className="col-md-4 mt-4 mt-md-0">
      <div className="card">
        <div className="card-header user-select-none">
          <span>关于我</span>
        </div>
        <ul className="list-group list-group-flush">
          <AboutRightAbout />
          <AboutRightLink />
        </ul>
      </div>
    </div>
  );
};

export default AboutRight;
