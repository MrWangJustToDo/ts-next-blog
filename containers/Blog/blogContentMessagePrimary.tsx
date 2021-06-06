import { useCallback } from "react";
import PageFoot from "components/PageFoot";
import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { apiName } from "config/api";
import { primaryMessageLength } from "config/message";
import { useBasePage } from "hook/useBase";
import { useMessageToReplayModule } from "hook/useMessage";
import BlogContentChildMessage from "./blogContentMessageChild";
import BlogContentReplayModule from "./blogContentReplayModule";
import { UseMessageToReplayModuleBody } from "types/hook";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";
import { BlogContentPrimaryMessageType, BlogContentPrimaryMessageWithReplayType } from "types/containers";

import style from "./index.module.scss";

const BlogContentPrimaryMessageWithReplay: BlogContentPrimaryMessageWithReplayType = ({ messages, replay }) => {
  const { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentPageData } = useBasePage<PrimaryMessageProps>({
    pageLength: primaryMessageLength,
    data: messages,
  });

  return (
    <>
      <div className="card-body">
        {currentPageData.map((item) => (
          <PrimaryMessage key={item.commentId} {...item} replayHandler={replay}>
            <LoadRender<ChildMessageProps[]>
              token
              revalidateOnFocus={false}
              apiPath={apiName.childMessage}
              query={{ primaryCommentId: String(item.commentId) }}
              loaded={(data) => (data.length ? <BlogContentChildMessage messages={data} primaryCommentId={item.commentId} /> : null)}
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

const BlogContentPrimaryMessage: BlogContentPrimaryMessageType = ({ messages }) => {
  const body = useCallback<UseMessageToReplayModuleBody<PrimaryMessageProps>>(
    ({ request, props }) =>
      (closeHandler) =>
        (
          <>
            <PrimaryMessage {...props} withReplay={false} withChildren={false} withHover={false} />
            <BlogContentReplayModule
              request={request}
              closeHandler={closeHandler}
              primaryCommentId={props.commentId}
              toUserId={props.fromUserId!}
              toIp={props.fromIp}
            />
          </>
        ),
    []
  );

  const replay = useMessageToReplayModule<PrimaryMessageProps>({
    body,
    className: style.replayModule,
  });

  return <BlogContentPrimaryMessageWithReplay messages={messages} replay={replay} />;
};

export default BlogContentPrimaryMessage;
