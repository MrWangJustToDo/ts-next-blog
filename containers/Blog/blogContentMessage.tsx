import { useMemo, useRef } from "react";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/dom";
import { useInViewport } from "hook/useInView";
import LoadRender from "components/LoadRender";
import BlogContentPrimaryMessage from "./blogContentMessagePrimary";
import { PrimaryMessageProps } from "types/components";
import { BlogContentMessageType } from "types/containers";

const BlogContentMessage: BlogContentMessageType = ({ blogId }) => {
  const childRef = useRef<JSX.Element | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInViewport({ ref });
  useMemo(() => {
    if (isInView) {
      childRef.current = childRef.current || (
        <LoadRender<PrimaryMessageProps[]>
          token
          query={{ blogId }}
          revalidateOnMount={isInView}
          apiPath={apiName.primaryMessage}
          loaded={(data) =>
            data.length ? <BlogContentPrimaryMessage messages={data} /> : <div className={getClass("p-5 text-danger", flexCenter)}>暂时没有留言</div>
          }
        />
      );
    }
  }, [isInView]);
  return (
    <li className="list-group-item">
      <div className="card" ref={ref}>
        <h5 className="card-header small">留言区</h5>
        {childRef.current}
        {/* <LoadRender<PrimaryMessageProps[]>
          token
          query={{ blogId }}
          revalidateOnMount={isInView}
          apiPath={apiName.primaryMessage}
          loaded={(data) =>
            data.length ? <BlogContentPrimaryMessage messages={data} /> : <div className={getClass("p-5 text-danger", flexCenter)}>暂时没有留言</div>
          }
        /> */}
      </div>
    </li>
  );
};

export default BlogContentMessage;
