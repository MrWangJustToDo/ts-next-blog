import Link from "next/link";
import { CardHeadType } from "types/components";
import { flexBetween, flexCenter, getClass } from "utils/class";

const CardHead: CardHeadType = ({ icon, content, hrefTo }) => {
  return (
    <div className={getClass(flexBetween, "card-header small")} style={{ borderBottom: "3px solid rgb(23, 162, 184)", backgroundColor: "#f4f6f8" }}>
      <div className={getClass(flexCenter)}>
        <i className={getClass(icon)}></i>
        <div className="ml-1">{content}</div>
      </div>
      {hrefTo && (
        <Link href={hrefTo}>
          <a className="text-decoration-none text-info" style={{ transitionProperty: "color", transitionDuration: "0.2s" }}>
            <span className="mr-l">more</span>
            <i className={getClass("ri-arrow-right-s-line align-middle")} />
          </a>
        </Link>
      )}
    </div>
  );
};

export default CardHead;
