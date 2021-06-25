import { useCallback } from "react";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import { ChildMessage } from "components/BlogMessage";
import { useCurrentUser, useUserRequest } from "hook/useUser";
import { useChildMessage, useMessageToDeleteModule, useMessageToReplayModule, useMessageToUpdateModule } from "hook/useMessage";
import BlogContentReplayModule from "./blogContentReplayModule";
import BlogContentDeleteModule from "./blogContentDeleteModule";
import BlogContentUpdateModule from "./blogContentUpdateModule";
import { UseMessageToModuleBody } from "types/hook";
import { ChildMessageProps } from "types/components";
import { BlogContentChildMessageType, BlogContentChildMessageWithReplayType } from "types/containers";

import style from "./index.module.scss";

const BlogContentChildMessageWithReplay: BlogContentChildMessageWithReplayType = ({ messages, childDelete, childReplay, childUpdate }) => {
  const { userId } = useCurrentUser();
  const { messageProps, more, loadMore } = useChildMessage(messages);

  return (
    <>
      {messageProps.map((item, index) => (
        <ChildMessage
          key={item.commentId}
          {...item}
          replayHandler={childReplay}
          withDelete={Boolean(userId)}
          deleteHandler={childDelete}
          withUpdate={Boolean(userId)}
          updateHandler={childUpdate}
        >
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

const BlogContentChildMessageReplay = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.putChildMessage, cache: false });

  const body = useCallback<UseMessageToModuleBody<ChildMessageProps>>(
    ({ props }) =>
      (closeHandler) =>
        (
          <>
            <ChildMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
            <BlogContentReplayModule request={request} closeHandler={closeHandler} props={props} />
          </>
        ),
    []
  );

  const childReplay = useMessageToReplayModule<ChildMessageProps>({
    body,
    className: style.replayModule,
  });

  return childReplay;
};

const BlogContentChildMessageDelete = () => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteChildMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<ChildMessageProps>>(
    ({ props }) =>
      (closeHandler) =>
        (
          <>
            <ChildMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
            <BlogContentDeleteModule<ChildMessageProps> request={request} closeHandler={closeHandler} props={props} />
          </>
        ),
    []
  );

  const childDelete = useMessageToDeleteModule<ChildMessageProps>({ body, className: style.deleteModule });

  return childDelete;
};

const BlogContentChildMessageUpdate = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.updateChildMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<ChildMessageProps>>(
    ({ props }) =>
      (closeHandler) => {
        return (
          <>
            <ChildMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
            <BlogContentUpdateModule request={request} props={props} closeHandler={closeHandler} />
          </>
        );
      },
    []
  );

  const childUpdate = useMessageToUpdateModule({ body, className: style.updateModule });

  return childUpdate;
};

const BlogContentChildMessage: BlogContentChildMessageType = ({ messages }) => {
  const childReplay = BlogContentChildMessageReplay();
  const childDelete = BlogContentChildMessageDelete();
  const childUpdate = BlogContentChildMessageUpdate();

  return <BlogContentChildMessageWithReplay messages={messages} childReplay={childReplay} childDelete={childDelete} childUpdate={childUpdate} />;
};

export default BlogContentChildMessage;
