import React, { useCallback } from "react";
import { FootPage } from "components/PageFoot";
import { LoadRender } from "components/LoadRender";
import { AnimationList } from "components/AnimationList";
import { PrimaryMessage } from "components/BlogMessage";
import { apiName } from "config/api";
import { primaryMessageLength } from "config/message";
import { useBasePage } from "hook/useBase";
import { useCurrentUser, useUserRequest } from "hook/useUser";
import { useMessageToReplayModule, useMessageToDeleteModule, useMessageToUpdateModule, UseMessageToModuleBody } from "hook/useMessage";
import { BlogContentChildMessage } from "./blogContentMessageChild";
import { BlogContentReplayModule } from "./blogContentReplayModule";
import { BlogContentDeleteModule } from "./blogContentDeleteModule";
import { BlogContentUpdateModule } from "./blogContentUpdateModule";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";

import style from "./index.module.scss";

const BlogContentPrimaryMessageWithFeature = ({
  messages,
  primaryReplay,
  primaryDelete,
  primaryUpdate,
}: {
  messages: PrimaryMessageProps[];
  primaryReplay: ReturnType<typeof useBlogContentPrimaryMessageReplay>;
  primaryDelete: ReturnType<typeof useBlogContentPrimaryMessageDelete>;
  primaryUpdate: ReturnType<typeof useBlogContentPrimaryMessageUpdate>;
}) => {
  const { userId } = useCurrentUser();
  const { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageData } = useBasePage<PrimaryMessageProps>({
    pageLength: primaryMessageLength,
    data: messages,
  });

  return (
    <>
      <div className="card-body">
        <AnimationList replace={true}>
          {currentPageData.map((item) => (
            <PrimaryMessage
              {...item}
              key={item.commentId}
              previewMod={false}
              replayHandler={primaryReplay}
              withDelete={Boolean(userId)}
              deleteHandler={primaryDelete}
              withUpdate={Boolean(userId)}
              updateHandler={primaryUpdate}
            >
              <LoadRender<ChildMessageProps[]>
                token
                apiPath={apiName.childMessage}
                query={{ primaryCommentId: item.commentId }}
                loaded={(data) => (data.length ? <BlogContentChildMessage messages={data} /> : null)}
              />
            </PrimaryMessage>
          ))}
        </AnimationList>
      </div>
      <FootPage
        page={currentPage}
        className={style.footPage}
        increaseAble={increaseAble}
        decreaseAble={decreaseAble}
        increasePage={increasePage}
        decreasePage={decreasePage}
      />
    </>
  );
};

const useBlogContentPrimaryMessageReplay = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.putChildMessage, cache: false });

  const body = useCallback<UseMessageToModuleBody<PrimaryMessageProps>>(({ props }) => {
    const WithReplay = (
      <>
        <PrimaryMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
        <BlogContentReplayModule request={request} props={props} toPrimary={1} />
      </>
    );
    return WithReplay;
  }, [request]);

  const primaryReplay = useMessageToReplayModule<PrimaryMessageProps>({
    body,
    className: style.replayModule,
  });

  return primaryReplay;
};

const useBlogContentPrimaryMessageDelete = () => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deletePrimaryMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<PrimaryMessageProps>>(({ props }) => {
    const WithDelete = (
      <>
        <PrimaryMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
        <BlogContentDeleteModule request={request} props={props} />
      </>
    );
    return WithDelete;
  }, [request]);

  const primaryDelete = useMessageToDeleteModule<PrimaryMessageProps>({ body, className: style.deleteModule });

  return primaryDelete;
};

const useBlogContentPrimaryMessageUpdate = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.updatePrimaryMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<PrimaryMessageProps>>(({ props }) => {
    const WithUpdate = (
      <>
        <PrimaryMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
        <BlogContentUpdateModule request={request} props={props} />
      </>
    );
    return WithUpdate;
  }, [request]);

  const primaryUpdate = useMessageToUpdateModule<PrimaryMessageProps>({ body, className: style.updateModule });

  return primaryUpdate;
};

export const BlogContentPrimaryMessage = ({ messages }: { messages: PrimaryMessageProps[] }) => {
  const primaryReplay = useBlogContentPrimaryMessageReplay();
  const primaryDelete = useBlogContentPrimaryMessageDelete();
  const primaryUpdate = useBlogContentPrimaryMessageUpdate();

  return <BlogContentPrimaryMessageWithFeature messages={messages} primaryReplay={primaryReplay} primaryDelete={primaryDelete} primaryUpdate={primaryUpdate} />;
};
