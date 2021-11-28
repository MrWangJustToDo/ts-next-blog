import { LoadRender } from "components/LoadRender";
import { CardHead as MainRightHead } from "components/CardHead";
import { AnimationList } from "components/AnimationList";
import { MainRightTypeItem } from "./mainRightTypeItem";
import { mainRightHeader } from "config/home";
import { apiName } from "config/api";
import { useType } from "hook/useType";
import { TypeProps } from "types";

export const MainRightType = ({ index }: { index: number }) => {
  const { type, changeCurrentType } = useType({ needInitType: true });

  const { icon, content, hrefTo } = mainRightHeader[index];

  return (
    <div className="card mt-4 mt-md-0">
      <MainRightHead icon={icon!} content={content!} hrefTo={hrefTo!} />
      <div className="card-body">
        <div className="list-group">
          <LoadRender<TypeProps[]>
            needUpdate
            needInitialData
            initialData={type}
            apiPath={apiName.type}
            loaded={(data) => (
              <AnimationList showClassName="fadeInUp">
                {data.map(({ typeId, typeContent, typeCount }) => (
                  <MainRightTypeItem key={typeId} typeName={typeContent} typeCount={typeCount} changeCurrentType={changeCurrentType} />
                ))}
              </AnimationList>
            )}
          />
        </div>
      </div>
    </div>
  );
};
