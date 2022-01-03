import { About as AboutContainer } from "containers/About";
import { animateFadeIn, getClass } from "utils/dom";
import { MyNextComponent } from "./_app";

const About: MyNextComponent = () => {
  return <div className={getClass("my-5 container", animateFadeIn)}><AboutContainer /></div>;
};

About.title = "关于我";

export default About;
