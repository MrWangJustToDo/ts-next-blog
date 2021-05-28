import Link from "next/link";
import { getClass, flexCenter } from "utils/class";
import { FootContainerContentItemType } from "types/components";

import style from "./index.module.scss";

const ColumnItem: FootContainerContentItemType = ({ head, content, title }) => {
  return (
    <dl className="row b-footer-font text-secondary m-0" title={title}>
      <dd className="col-5 text-right m-0">{head}</dd>
      <dd className="col-7 text-left text-truncate m-0">{content}</dd>
    </dl>
  );
};

const IconItem: FootContainerContentItemType = ({ icon, content, hrefTo, title }) => {
  return (
    <Link href={hrefTo!}>
      <a className={getClass(style.hover, "d-block mx-4 text-decoration-none", flexCenter)} title={title}>
        <i className={getClass(icon!, "mr-2")}></i>
        <span className={getClass("d-block", "text-truncate")}>{content}</span>
      </a>
    </Link>
  );
};

const FootContainerContentItem: FootContainerContentItemType = ({
  column = 1,
  head = "hello",
  content = "hello",
  icon = "ri-links-line",
  hrefTo = "/",
  title = content,
}) => {
  return (
    <li className="text-truncate my-1">
      {column === 1 ? <IconItem icon={icon} content={content} hrefTo={hrefTo} title={title} /> : <ColumnItem head={head} content={content} title={title} />}
    </li>
  );
};

export default FootContainerContentItem;
