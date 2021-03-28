import CardPage from "components/PageFoot";
import Loading from "components/Loading";
import { WithWriteBlogItem as SearchResult } from "components/BlogItem";
import { useBasePage } from "hook/useBase";
import { manageLength } from "config/manage";
import { BlogContentProps } from "types/hook";

const ManageResultSearch = (props: { data?: BlogContentProps[]; loading?: boolean } = {}) => {
  const { data = [], loading = false } = props;

  const { currentPageData, currentPage, increaseAble, increasePage, decreaseAble, decreasePage } = useBasePage<BlogContentProps>({
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
            <SearchResult key={props.blogId} {...props} />
          ))}
          <CardPage className="border-0" page={currentPage} {...{ increaseAble, decreaseAble, increasePage, decreasePage }} />
        </>
      ) : (
        <div className="card-body text-danger">没有搜索结果！</div>
      )}
    </>
  );
};

export default ManageResultSearch;
