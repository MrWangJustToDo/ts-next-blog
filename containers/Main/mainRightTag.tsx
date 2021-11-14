import { LoadRender } from "components/LoadRender";
import { CardHead as MainRightHead } from "components/CardHead";
import { AnimationList } from "components/AnimationList";
import { MainRightTagItem } from "./mainRightTagItem";
import { mainRightHeader } from "config/home";
import { apiName } from "config/api";
import { useTag } from "hook/useTag";
import { ServerTagProps } from "types";

export const MainRightTag = ({ index }: { index: number }) => {
  const { tag, changeCurrentTag } = useTag({ needInitTag: true });

  const { icon, content, hrefTo } = mainRightHeader[index];

  return (
    <div className="card mt-4">
      <MainRightHead icon={icon!} content={content!} hrefTo={hrefTo!} />
      <div className="card-body">
        <LoadRender<ServerTagProps[]>
          needUpdate
          needInitialData
          initialData={tag}
          apiPath={apiName.tag}
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
