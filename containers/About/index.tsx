import AboutLeft from "./aboutLeft";
import AboutRight from "./aboutRight";
import { SimpleElement } from "types/components";

const About: SimpleElement = () => {
  return (
    <div className="mx-lg-4 row">
      <AboutLeft />
      <AboutRight />
    </div>
  );
};

export default About;
