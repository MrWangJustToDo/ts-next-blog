import { CardHead as MainRightHead } from "components/CardHead";
import { MainRightCommendItem } from "./mainRightCommendItem";
import { mainRightHeader } from "config/home";
import { useCommend } from "hook/useHome";

export const MainRightCommend = ({ index }: { index: number }) => {
  const { commendBlogs } = useCommend();

  const { icon, content, hrefTo } = mainRightHeader[index];

  return (
    <div className="card mt-4">
      <MainRightHead icon={icon!} content={content!} hrefTo={hrefTo!} />
      <div className="list-group list-group-flush">
        {commendBlogs.map(({ blogId, blogTitle }) => (
          <MainRightCommendItem key={blogId} blogId={blogId!} blogTitle={blogTitle!} />
        ))}
      </div>
    </div>
  );
};
