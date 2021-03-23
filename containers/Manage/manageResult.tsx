import { useResult } from "hook/useManage";
import CardPage from "components/PageFoot";
import { WithWriteBlogItem as SearchResult } from "components/BlogItem";
import { SimpleElement } from "containers/Main/@type";

let ManageResult: SimpleElement;

ManageResult = () => {
  const { currentResult, page, increaseAble, decreaseAble, increasePage, decreasePage } = useResult();
  return (
    <div className="card mt-4">
      {currentResult.length ? (
        <>
          <div className="card-body">
            {currentResult.map((props) => (
              <SearchResult {...props} />
            ))}
          </div>
          <CardPage {...{ page, increaseAble, decreaseAble, increasePage, decreasePage }} />
        </>
      ) : (
        <div className="card-body text-danger">没有搜索结果！</div>
      )}
    </div>
  );
};

export default ManageResult;
