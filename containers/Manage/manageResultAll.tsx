import CardPage from "components/PageFoot";
import { WithWriteBlogItem as SearchResult } from "components/BlogItem";
import { useBasePage } from "hook/useBase";
import { BlogContentProps } from "types/hook";
import { ManageResultType } from "types/containers";

const ManageResultAll: ManageResultType = (props) => {
  const { currentPage, currentPageData, increaseAble, increasePage, decreaseAble, decreasePage } = useBasePage<BlogContentProps>({
    data: props,
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
