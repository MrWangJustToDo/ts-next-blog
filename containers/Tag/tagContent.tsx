import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { WithReadBlogItem as TagContentItem } from "components/BlogItem";
import { useTag } from "hook/useTag";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/class";
import { TagContentType } from "types/containers";
import { PrimaryMessageProps } from "types/components";

import style from "./index.module.scss";

let TagContent: TagContentType;

TagContent = ({ blogs }) => {
  const { currentPageBlogs } = useTag(blogs);

  return (
    <ul className="p-0">
      {currentPageBlogs.length ? (
        currentPageBlogs.map((props) => (
          <li key={props.blogId} className="d-flex">
            <div className="col-lg-8 px-0">
              <TagContentItem {...props} _style={{ height: "100%" }} />
            </div>
            <div className={getClass("col-lg-4 border-left border-bottom py-2", style.autoHide)}>
              <LoadRender<PrimaryMessageProps[]>
                method="post"
                apiPath={apiName.primaryMessage}
                query={{ blogId: props.blogId! }}
                requestData={{ blogId: props.blogId }}
                loaded={(data) => (
                  <>
                    {data.length ? (
                      data.map((props) => <PrimaryMessage key={props.modifyDate} {...props} withReplay={false} withChildren={false} withHover={false} />)
                    ) : (
                      <div className="text-danger p-2 text-center">nothing</div>
                    )}
                  </>
                )}
              />
            </div>
          </li>
        ))
      ) : (
        <div className={getClass("p-5 text-danger", flexCenter)}>nothing to display</div>
      )}
    </ul>
  );
};

export default TagContent;
