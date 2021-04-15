import CardPage from "components/PageFoot";
import { WithWriteBlogItem as SearchResult } from "components/BlogItem";
import { apiName } from "config/api";
import { useBasePage } from "hook/useBase";
import { BlogContentProps } from "types/hook";
import { ManageResultType } from "types/containers";

let ManageResultAll: ManageResultType;

ManageResultAll = (props) => {
  const { currentPage, currentPageData, increaseAble, increasePage, decreaseAble, decreasePage } = useBasePage<BlogContentProps>({
    data: props,
    stateSide: "server",
    stateName: apiName.userHome,
  });

  return (
    <>
      {currentPageData.length ? (
        <>
          {currentPageData.map((props) => (
            <SearchResult key={props.blogId} {...props} />
          ))}
          <CardPage className="border-0" page={currentPage} {...{ increaseAble, decreaseAble, increasePage, decreasePage }} />
        </>
      ) : (
        <div className="card-body text-danger">没有结果显示！</div>
      )}
    </>
  );
};

export default ManageResultAll;
