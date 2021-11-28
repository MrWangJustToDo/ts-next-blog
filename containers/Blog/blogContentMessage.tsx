import { useRef } from "react";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/dom";
import { useInViewport } from "hook/useInView";
import { LoadRender } from "components/LoadRender";
import { BlogContentPrimaryMessage } from "./blogContentMessagePrimary";
import { BlogProps, PrimaryCommentProps, UserProps } from "types";

export const BlogContentMessage = ({ blogId }: Pick<BlogProps, "blogId">) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInViewport({ ref });
  const isViewRef = useRef(isInView);
  isViewRef.current = isViewRef.current || isInView;
  return (
    <li className="list-group-item">
      <div className="card" ref={ref}>
        <h5 className="card-header small">留言区</h5>
        {isViewRef.current && (
          <LoadRender<Array<PrimaryCommentProps & UserProps>>
            token
            query={{ blogId }}
            revalidateOnMount={isInView}
            apiPath={apiName.primaryMessage}
            loaded={(data) =>
              data.length ? <BlogContentPrimaryMessage messages={data} /> : <div className={getClass("p-5 text-danger", flexCenter)}>暂时没有留言</div>
            }
          />
        )}
      </div>
    </li>
  );
};
