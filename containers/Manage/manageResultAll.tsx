import { FootPage } from "components/PageFoot";
import { WithWriteBlogItem as SearchResult } from "components/BlogItem";
import { useBasePage } from "hook/useBase";
import type { ClientTagProps, HomeBlogProps, TypeProps, UserProps } from "types";

export const ManageResultAll = ({ data }: { data: Array<HomeBlogProps & UserProps & TypeProps & ClientTagProps> }) => {
  const { currentPage, currentPageData, increaseAble, increasePage, decreaseAble, decreasePage } = useBasePage({
    data,
  });

  return (
    <>
      {currentPageData.length ? (
        <>
          {currentPageData.map((props) => (
            <SearchResult key={props.blogId} {...props} />
          ))}
          <FootPage className="border-0" page={currentPage} {...{ increaseAble, decreaseAble, increasePage, decreasePage }} />
        </>
      ) : (
        <div className="card-body text-danger">没有结果显示！</div>
      )}
    </>
  );
};
