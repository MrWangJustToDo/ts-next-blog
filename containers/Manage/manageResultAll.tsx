import CardPage from "components/PageFoot";
import { WithWriteBlogItem as SearchResult } from "components/BlogItem";
import { apiName } from "config/api";
import { useBasePage } from "hook/useBase";
import { BlogContentProps } from "types/hook";
import { SimpleElement } from "types/components";

let ManageResultAll: SimpleElement;

ManageResultAll = () => {
  const { currentPage, currentPageData, increaseAble, increasePage, decreaseAble, decreasePage } = useBasePage<BlogContentProps>({
    stateSide: "server",
    stateName: apiName.home,
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
