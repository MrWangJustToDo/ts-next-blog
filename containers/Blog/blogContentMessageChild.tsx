import { useCallback } from "react";
import { apiName } from "config/api";
import { getClass } from "utils/dom";
import { ChildMessage } from "components/BlogMessage";
import { useCurrentUser, useUserRequest } from "hook/useUser";
import { useChildMessage, useMessageToDeleteModule, UseMessageToModuleBody, useMessageToReplayModule, useMessageToUpdateModule } from "hook/useMessage";
import { BlogContentReplayModule } from "./blogContentReplayModule";
import { BlogContentDeleteModule } from "./blogContentDeleteModule";
import { BlogContentUpdateModule } from "./blogContentUpdateModule";
import { ChildMessageProps } from "types/components";

import style from "./index.module.scss";

const BlogContentChildMessageWithFeature = ({
  messages,
  childDelete,
  childReplay,
  childUpdate,
}: {
  messages: ChildMessageProps[];
  childDelete: ReturnType<typeof useBlogContentChildMessageDelete>;
  childReplay: ReturnType<typeof useBlogContentChildMessageReplay>;
  childUpdate: ReturnType<typeof useBlogContentChildMessageUpdate>;
}) => {
  const { userId } = useCurrentUser();
  const { messageProps, more, loadMore } = useChildMessage(messages);

  return (
    <>
      {messageProps.map((item, index) => (
        <ChildMessage
          key={item.commentId}
          {...item}
          previewMod={false}
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
            <span />
          )}
        </ChildMessage>
      ))}
    </>
  );
};

const useBlogContentChildMessageReplay = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.putChildMessage, cache: false });

  const body = useCallback<UseMessageToModuleBody<ChildMessageProps>>(
    ({ props }) => {
      const WithReplay = (
        <>
          <ChildMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
          <BlogContentReplayModule request={request} props={props} />
        </>
      );
      return WithReplay;
    },
    [request]
  );

  const childReplay = useMessageToReplayModule<ChildMessageProps>({
    body,
    className: style.replayModule,
  });

  return childReplay;
};

const useBlogContentChildMessageDelete = () => {
  const request = useUserRequest({ method: "delete", apiPath: apiName.deleteChildMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<ChildMessageProps>>(
    ({ props }) => {
      const WithDelete = (
        <>
          <ChildMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
          <BlogContentDeleteModule request={request} props={props} />
        </>
      );
      return WithDelete;
    },
    [request]
  );

  const childDelete = useMessageToDeleteModule<ChildMessageProps>({ body, className: style.deleteModule });

  return childDelete;
};

const useBlogContentChildMessageUpdate = () => {
  const request = useUserRequest({ method: "post", apiPath: apiName.updateChildMessage, cache: false, header: { apiToken: true } });

  const body = useCallback<UseMessageToModuleBody<ChildMessageProps>>(
    ({ props }) => {
      const WithUpdate = (
        <>
          <ChildMessage {...props} withReplay={false} withDelete={false} withUpdate={false} withChildren={false} withHover={false} />
          <BlogContentUpdateModule request={request} props={props} />
        </>
      );
      return WithUpdate;
    },
    [request]
  );

  const childUpdate = useMessageToUpdateModule({ body, className: style.updateModule });

  return childUpdate;
};

export const BlogContentChildMessage = ({ messages }: { messages: ChildMessageProps[] }) => {
  const childReplay = useBlogContentChildMessageReplay();
  const childDelete = useBlogContentChildMessageDelete();
  const childUpdate = useBlogContentChildMessageUpdate();

  return <BlogContentChildMessageWithFeature messages={messages} childReplay={childReplay} childDelete={childDelete} childUpdate={childUpdate} />;
};
