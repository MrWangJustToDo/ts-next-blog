import { useCallback, useMemo } from "react";
import { ChildMessage } from "components/BlogMessage";
import { useChildMessage, useMessageToReplayModule } from "hook/useMessage";
import { apiName } from "config/api";
import { getClass } from "utils/class";
import { createRequest } from "utils/fetcher";
import BlogContentReplayModule from "./blogContentReplayModule";
import { AutoRequestType } from "types/utils";
import { ChildMessageProps } from "types/components";
import { BlogContentChildMessageType, BlogContentChildMessageWithReplayType } from "types/containers";

import style from "./index.module.scss";

let BlogContentChildMessageWithReplay: BlogContentChildMessageWithReplayType;

let BlogContentChildMessage: BlogContentChildMessageType;

BlogContentChildMessageWithReplay = ({ messages, replay }) => {

  const { messageProps, more, loadMore } = useChildMessage(messages);
  
  return (
    <>
      {messageProps.map((item, index) => (
        <ChildMessage key={item.commentId} {...item} replayHandler={replay}>
          {index === messageProps.length - 1 && more ? (
            <button className={getClass("btn btn-info float-right", style.loadMore)} onClick={loadMore}>
              loadMore
            </button>
          ) : (
            <span></span>
          )}
        </ChildMessage>
      ))}
    </>
  );
};

BlogContentChildMessage = ({ messages }) => {

  const request = useMemo(() => createRequest({ method: "post", path: apiName.putChildMessage }), []);

  const body = useCallback<(request: AutoRequestType) => (props: ChildMessageProps) => (closeHandler: () => void) => JSX.Element>(
    (request) => (props) => (closeHandler) => (
      <>
        <ChildMessage {...props} withReplay={false} withChildren={false} />
        <BlogContentReplayModule request={request} closeHandler={closeHandler} />
      </>
    ),
    []
  );

  const replay = useMessageToReplayModule<ChildMessageProps>({
    body,
    className: style.replayModule,
    request,
  });

  return <BlogContentChildMessageWithReplay messages={messages} replay={replay} />;
};

export default BlogContentChildMessage;
