import { useCallback } from "react";
import { getClass } from "utils/dom";
import { ChildMessage } from "components/BlogMessage";
import { useChildMessage, useMessageToReplayModule } from "hook/useMessage";
import BlogContentReplayModule from "./blogContentReplayModule";
import { ChildMessageProps } from "types/components";
import { UseMessageToReplayModuleBody } from "types/hook";
import { BlogContentChildMessageType, BlogContentChildMessageWithReplayType } from "types/containers";

import style from "./index.module.scss";

const BlogContentChildMessageWithReplay: BlogContentChildMessageWithReplayType = ({ messages, replay }) => {
  const { messageProps, more, loadMore } = useChildMessage(messages);

  return (
    <>
      {messageProps.map((item, index) => (
        <ChildMessage key={item.commentId} {...item} replayHandler={replay}>
          {index === messageProps.length - 1 && more ? (
            <button className={getClass("btn btn-info float-right", style.loadMore)} onClick={loadMore}>
              加载更多
            </button>
          ) : (
            <span></span>
          )}
        </ChildMessage>
      ))}
    </>
  );
};

const BlogContentChildMessage: BlogContentChildMessageType = ({ messages, primaryCommentId }) => {
  const body = useCallback<UseMessageToReplayModuleBody<ChildMessageProps>>(
    ({ request, props }) =>
      (closeHandler) =>
        (
          <>
            <ChildMessage {...props} withReplay={false} withChildren={false} withHover={false} />
            <BlogContentReplayModule
              request={request}
              closeHandler={closeHandler}
              primaryCommentId={primaryCommentId}
              toUserId={props.fromUserId}
              toIp={props.fromIp}
            />
          </>
        ),
    []
  );

  const replay = useMessageToReplayModule<ChildMessageProps>({
    body,
    className: style.replayModule,
  });

  return <BlogContentChildMessageWithReplay messages={messages} replay={replay} />;
};

export default BlogContentChildMessage;
