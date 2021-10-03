import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { WithReadBlogItem as TypeContentItem } from "components/BlogItem";
import { useType } from "hook/useType";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/dom";
import { TypeContentType } from "types/containers";
import { PrimaryMessageProps } from "types/components";

import style from "./index.module.scss";

const TypeContent: TypeContentType = ({ blogs }) => {
  const { currentPageBlogs } = useType({ blogs, needInitType: true });

  return (
    <ul className="p-0">
      {currentPageBlogs.length ? (
        currentPageBlogs.map((props) => (
          <li key={props.blogId} className="d-flex">
            <div className="col-lg-8 px-0">
              <TypeContentItem {...props} _style={{ height: "100%" }} />
            </div>
            <div className={getClass("col-lg-4 border-left border-bottom py-2", style.autoHide)}>
              <LoadRender<PrimaryMessageProps[]>
                apiPath={apiName.primaryMessage}
                query={{ blogId: props.blogId! }}
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

export default TypeContent;
