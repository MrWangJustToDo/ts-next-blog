import Link from "next/link";
import { momentTo } from "utils/time";
import { flexBetween, flexCenter, getClass } from "utils/dom";
import { AnimationList } from "components/AnimationList";
import { ArchiveContentType } from "types/containers";

import style from "./index.module.scss";

const ArchiveContent: ArchiveContentType = ({ year, blogProps }) => {
  return (
    <>
      <h3 className="text-center display-5 my-3">{year}</h3>
      <ul className="list-group user-select-none mb-5">
        <AnimationList showClassName="fadeIn">
          {blogProps.map((props) => (
            <Link key={props.blogCreateDate} href={`/blog/${props.blogId}`}>
              <a className={getClass("list-group-item list-group-item-action", flexBetween)}>
                <div className={getClass(flexCenter)}>
                  <i className={getClass("ri-checkbox-blank-circle-fill text-info small", style.archivePoint)} />
                  <span className={getClass("mx-2 text-truncate", style.archiveTitle)} title={props.blogTitle}>
                    {props.blogTitle}
                  </span>
                  <span className="border badge rounded border-info text-info px-2 small font-weight-light">{momentTo(props.blogCreateDate!)}</span>
                </div>
                <span className="border badge rounded border-danger text-danger px-2 small font-weight-light">{props.typeContent}</span>
              </a>
            </Link>
          ))}
        </AnimationList>
      </ul>
    </>
  );
};

export default ArchiveContent;
