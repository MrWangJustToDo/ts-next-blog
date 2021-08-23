import React, { useCallback } from "react";
import PageFoot from "components/PageFoot";
import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { apiName } from "config/api";
import { primaryMessageLength } from "config/message";
import { useBasePage } from "hook/useBase";
import { useCurrentUser, useUserRequest } from "hook/useUser";
import { useMessageToReplayModule, useMessageToDeleteModule, useMessageToUpdateModule } from "hook/useMessage";
import BlogContentChildMessage from "./blogContentMessageChild";
import BlogContentReplayModule from "./blogContentReplayModule";
import BlogContentDeleteModule from "./blogContentDeleteModule";
import BlogContentUpdateModule from "./blogContentUpdateModule";
import { UseMessageToModuleBody } from "types/hook";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";
import { BlogContentPrimaryMessageType, BlogContentPrimaryMessageWrapperType } from "types/containers";

import style from "./index.module.scss";

const BlogContentPrimaryMessage: BlogContentPrimaryMessageType = ({ messages, primaryReplay, primaryDelete, primaryUpdate }) => {
  const { userId } = useCurrentUser();
  const { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageData } = useBasePage<PrimaryMessageProps>({
    pageLength: primaryMessageLength,
    data: messages,
  });

  return (
    <>
      <div className="card-body">
        {currentPageData.map((item) => (
          <PrimaryMessage
            {...item}
            key={item.commentId}
            replayHandler={primaryReplay}
            withDelete={Boolean(userId)}
            deleteHandler={primaryDelete}
            withUpdate={Boolean(userId)}
            updateHandler={primaryUpdate}
          >
            <LoadRender<ChildMessageProps[]>
              token
              revalidateOnFocus={false}
              apiPath={apiName.childMessage}
              query={{ primaryCommentId: item.commentId }}
              loaded={(data) => (data.length ? <BlogContentChildMessage messages={data} /> : null)}
            />
          </PrimaryMessage>
        ))}
      </div>
      <PageFoot
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

const BlogContentPrimaryMessageReplay = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.putChildMessage, cache: false });

  const body = useCallback<UseMessageToModuleBody<PrimaryMessageProps>>(
    ({ props }) =>
      (closeHandler) =>
        (
          <>
            <PrimaryMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
            <BlogContentReplayModule request={request} closeHandler={closeHandler} props={props} />
          </>
        ),
    []
  );

  const primaryReplay = useMessageToReplayModule<PrimaryMessageProps>({
    body,
    className: style.replayModule,
  });

  return primaryReplay;
};

const BlogContentPrimaryMessageDelete = () => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deletePrimaryMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<PrimaryMessageProps>>(
    ({ props }) =>
      (closeHandler) =>
        (
          <>
            <PrimaryMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
            <BlogContentDeleteModule<PrimaryMessageProps> request={request} closeHandler={closeHandler} props={props} />
          </>
        ),
    []
  );

  const primaryDelete = useMessageToDeleteModule<PrimaryMessageProps>({ body, className: style.deleteModule });

  return primaryDelete;
};

const BlogContentPrimaryMessageUpdate = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.updatePrimaryMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<PrimaryMessageProps>>(
    ({ props }) =>
      (closeHandler) => {
        return (
          <>
            <PrimaryMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
            <BlogContentUpdateModule request={request} props={props} closeHandler={closeHandler} />
          </>
        );
      },
    []
  );

  const primaryUpdate = useMessageToUpdateModule<PrimaryMessageProps>({ body, className: style.updateModule });

  return primaryUpdate;
};

const BlogContentPrimaryMessageWrapper: BlogContentPrimaryMessageWrapperType = ({ messages }) => {
  const primaryReplay = BlogContentPrimaryMessageReplay();
  const primaryDelete = BlogContentPrimaryMessageDelete();
  const primaryUpdate = BlogContentPrimaryMessageUpdate();

  return <BlogContentPrimaryMessage messages={messages} primaryReplay={primaryReplay} primaryDelete={primaryDelete} primaryUpdate={primaryUpdate} />;
};

export default BlogContentPrimaryMessageWrapper;
