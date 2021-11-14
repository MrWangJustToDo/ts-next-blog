import { FootPage } from "components/PageFoot";
import { Loading } from "components/Loading";
import { ManageDeleteBlogItem } from "./manageDeleteBlogItem";
import { getClass } from "utils/dom";
import { useBasePage } from "hook/useBase";
import { manageLength } from "config/manage";
import { ClientReducer } from "store/reducer/client/type";
import { actionName } from "config/action";

import style from "./index.module.scss";

export const ManageResultSearch = (props: { data?: ClientReducer[actionName.currentResult]["data"]; loading?: boolean } = {}) => {
  const { data = [], loading = false } = props;

  const { currentPageData, currentPage, increaseAble, increasePage, decreaseAble, decreasePage } = useBasePage({
    data,
    pageLength: manageLength,
  });

  return (
    <>
      {loading ? (
        <Loading className="m-5" />
      ) : currentPageData.length ? (
        <>
          {currentPageData.map((props) => (
            <div key={props.blogId} className={getClass("position-relative", style.blogItem)}>
              <ManageDeleteBlogItem {...props} />
            </div>
          ))}
          <FootPage className="border-0" page={currentPage} {...{ increaseAble, decreaseAble, increasePage, decreasePage }} />
        </>
      ) : (
        <div className="card-body text-danger">没有搜索结果！</div>
      )}
    </>
  );
};
