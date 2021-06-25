import LoadRender from "components/LoadRender";
import MainRightHead from "components/CardHead";
import AnimationList from "components/AnimationList";
import MainRightTagItem from "./mainRightTagItem";
import { mainRightHeader } from "config/hoom";
import { apiName } from "config/api";
import { useTag } from "hook/useTag";
import { MainRightTagType, TagProps } from "types/containers";

const MainRightTag: MainRightTagType = ({ index }) => {
  const { tag, changeCurrentTag } = useTag({ needInitTag: true });

  const { icon, content, hrefTo } = mainRightHeader[index];

  return (
    <div className="card mt-4">
      <MainRightHead icon={icon!} content={content!} hrefTo={hrefTo!} />
      <div className="card-body">
        <LoadRender<TagProps[]>
          needUpdate
          needinitialData
          initialData={tag}
          apiPath={apiName.tag}
          revalidateOnFocus={false}
          loaded={(data) => (
            <AnimationList showClassName="bounceInDown">
              {data.map(({ tagId, tagContent, tagCount }) => (
                <MainRightTagItem key={tagId} tagName={tagContent!} tagCount={tagCount!} changeCurrentTag={changeCurrentTag} />
              ))}
            </AnimationList>
          )}
        />
      </div>
    </div>
  );
};

export default MainRightTag;
