import { getClass, flexCenter } from "utils/class";
import LoadRender from "components/LoadRender";
import { SimpleElement, YiYanComponent } from "types/components";

import style from "./index.module.scss";

let Bquote: YiYanComponent;

let FootContainerYiYan: SimpleElement;

Bquote = ({ hitokoto, from_who, from }) => {
  return (
    <blockquote className={getClass(style.bquoteFont, "text-center m-0")}>
      <p className="m-0">{hitokoto}</p>
      <footer className="blockquote-footer text-right">
        {from_who}
        <cite className="ml-2">{from}</cite>
      </footer>
    </blockquote>
  );
};

FootContainerYiYan = () => {
  return (
    <div className={getClass(style.autoHide, "col-lg-4 text-white border-left border-secondary")}>
      <h6 className={getClass(style.fontInherit, "my-2 mb-lg-3", flexCenter)}>
        <i className="ri-pantone-line mr-2"></i>
        <div>一言</div>
      </h6>
      <LoadRender path={process.env.NEXT_PUBLIC_ONESAY} loaded={Bquote} />
    </div>
  );
};

export default FootContainerYiYan;
