import AboutContainer from "containers/About";
import { animateFadein, getClass } from "utils/class";
import { MyNextComponent } from "./_app";

let About: MyNextComponent;

About = () => {
  return (
    <div className={getClass("my-5 container", animateFadein)}>
      <AboutContainer />
    </div>
  );
};

About.title = "关于我";

export default About;
