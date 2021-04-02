import { RefObject, useCallback, useMemo } from "react";
import { mutate } from "swr";
import { apiName } from "config/api";
import { transformPath } from "utils/path";
import { createRequest } from "utils/fetcher";
import { usePutToCheckcodeModule } from "hook/useMessage";
import BlogContentCheckcodeModule from "./blogContentCheckcodeModule";
import { MyInputELement } from "types/hook";
import { AutoRequestType } from "types/utils";
import { BlogContentMessagePutType } from "types/containers";

import style from "./index.module.scss";

let BlogContentMessagePut: BlogContentMessagePutType;

BlogContentMessagePut = ({ blogId }) => {
  const request = useMemo(() => createRequest({ method: "post", path: apiName.putPrimaryMessage, data: { blogId } }), [blogId]);

  const body = useCallback<
    (request: AutoRequestType) => (ref: RefObject<MyInputELement>) => (successCallback: () => void) => (closeHandler: () => void) => JSX.Element
  >(
    (request) => (ref) => (successCallback) => (close) => (
      <BlogContentCheckcodeModule request={request} closeHandler={close} messageRef={ref} successCallback={successCallback} />
    ),
    []
  );

  const successCallback = useCallback(() => mutate(transformPath({ apiPath: apiName.primaryMessage, query: { blogId }, needPre: false })), [blogId]);

  const { ref, submit, canSubmit } = usePutToCheckcodeModule<HTMLTextAreaElement>({
    request,
    body,
    className: style.imgCheck,
    successCallback,
  });

  return (
    <li className="list-group-item">
      <textarea className="w-100 my-2 border rounded" placeholder="请输入留言" style={{ minHeight: "100px" }} ref={ref} />
      <button className="btn btn-sm btn-primary" onClick={submit} disabled={!canSubmit}>
        新留言
      </button>
    </li>
  );
};

export default BlogContentMessagePut;
