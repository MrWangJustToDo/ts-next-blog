import LoadRender from "components/LoadRender";
import MainRightHead from "components/CardHead";
import MainRightTagItem from "./mainRightTagItem";
import { mainRightHeader } from "config/hoom";
import { apiName } from "config/api";
import { useTag } from "hook/useTag";
import { MainRightTagType, TagProps } from "types/containers";

let MainRightTag: MainRightTagType;

MainRightTag = ({ index }) => {
  const { tag, changeCurrentTag } = useTag();

  const { icon, content, hrefTo } = mainRightHeader[index];

  return (
    <div className="card mt-4">
      <MainRightHead icon={icon!} content={content!} hrefTo={hrefTo!} />
      <div className="card-body">
        <LoadRender<TagProps[]>
          needUpdate
          needinitialData
          apiPath={apiName.tag}
          initialData={tag}
          loaded={(data) => (
            <>
              {data.map(({ tagId, tagContent, tagCount }) => (
                <MainRightTagItem key={tagId} tagName={tagContent!} tagCount={tagCount!} changeCurrentTag={changeCurrentTag} />
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
};

export default MainRightTag;
