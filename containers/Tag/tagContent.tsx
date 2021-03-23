import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { WithReadBlogItem as TagContentItem } from "components/BlogItem";
import { useTag } from "hook/useTag";
import { apiName } from "config/api";
import { getClass } from "utils/class";
import { TagContentType } from "types/containers";
import { PrimaryMessageProps } from "types/components";

import style from "./index.module.scss";

let TagContent: TagContentType;

TagContent = ({ blogs }) => {
  const { currentPageBlogs } = useTag(blogs);
  return (
    <ul className="p-0">
      {currentPageBlogs.map((props) => (
        <div key={props.blogId} className="d-flex">
          <div className="col-lg-8 px-0">
            <TagContentItem {...props} />
          </div>
          <div className={getClass("col-lg-4 border-left py-2", style.autoHide)}>
            <LoadRender<PrimaryMessageProps[]>
              method="post"
              apiPath={apiName.primaryMessage}
              requestData={{ blogId: props.blogId }}
              loaded={(data) => (
                <>
                  {data.map((props) => (
                    <PrimaryMessage key={props.modifyDate} {...props} withReplay={false} withChildren={false} withHover={false} />
                  ))}
                </>
              )}
            />
          </div>
        </div>
      ))}
    </ul>
  );
};

export default TagContent;
