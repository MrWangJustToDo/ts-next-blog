import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { WithReadBlogItem as TypeContentItem } from "components/BlogItem";
import useType from "hook/useType";
import { apiName } from "config/api";
import { getClass } from "utils/class";
import { TypeContentType } from "types/containers";
import { PrimaryMessageProps } from "types/components";

import style from "./index.module.scss";

let TypeContent: TypeContentType;

TypeContent = ({ blogs }) => {
  const { currentPageBlogs } = useType(blogs);

  return (
    <ul className="p-0">
      {currentPageBlogs.map((props) => (
        <div key={props.blogId} className="d-flex">
          <div className="col-lg-8 px-0">
            <TypeContentItem {...props} />
          </div>
          <div className={getClass("col-lg-4 border-left border-bottom py-2", style.autoHide)}>
            <LoadRender<PrimaryMessageProps[]>
              method="post"
              apiPath={apiName.primaryMessage}
              query={{ blogId: props.blogId! }}
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

export default TypeContent;
