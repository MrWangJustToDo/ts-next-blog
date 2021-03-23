import { useMemo } from "react";
import PageFoot from "components/PageFoot";
import LoadRender from "components/LoadRender";
import { PrimaryMessage } from "components/BlogMessage";
import { apiName } from "config/api";
import { createRequest } from "utils/fetcher";
import { usePrimaryMessage, useMessageToReplayModule } from "hook/useMessage";
import BlogContentChildMessage from "./blogContentMessageChild";
import BlogContentReplayModule from "./blogContentReplayModule";
import { BlogContentPrimaryMessageType, BlogContentPrimaryMessageWithReplayType } from "types/containers";

import style from "./index.module.scss";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";

let BlogContentPrimaryMessage: BlogContentPrimaryMessageType;

let BlogContentPrimaryMessageWithReplay: BlogContentPrimaryMessageWithReplayType;

BlogContentPrimaryMessageWithReplay = ({ messages, replay }) => {
  const { currentPage, increaseAble, decreaseAble, increasePage, decreasePage, currentMessage } = usePrimaryMessage(messages);
  return (
    <>
      <div className="card-body">
        {currentMessage.map((item) => (
          <PrimaryMessage key={item.commentId} {...item} replayHandler={replay}>
            <LoadRender<ChildMessageProps[]>
              token
              method="post"
              apiPath={apiName.childMessage}
              query={{ primaryCommentId: String(item.commentId) }}
              requestData={{ primaryCommentId: item.commentId }}
              loaded={(data) => <BlogContentChildMessage messages={data} />}
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

BlogContentPrimaryMessage = ({ messages }) => {
  const request = useMemo(() => createRequest({ method: "post", path: apiName.putPrimaryMessage }), []);
  const replay = useMessageToReplayModule<PrimaryMessageProps>({
    body: (request) => (props) => (closeHandler) => (
      <>
        <PrimaryMessage {...props} withReplay={false} withChildren={false} />
        <BlogContentReplayModule request={request} closeHandler={closeHandler} />
      </>
    ),
    className: style.replayModule,
    request,
  });
  return <BlogContentPrimaryMessageWithReplay messages={messages} replay={replay} />;
};

export default BlogContentPrimaryMessage;
