import { apiName } from "config/api";
import { Button } from "components/Button";
import { BlogContentMessageTextArea } from "./blogContentMessagePut";
import { BlogContentMessageMarkdownWithMemo } from "./blogContentMessageMarkdown";
import { flexBetween, flexCenter, getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { useAutoLoadCheckCodeImg } from "hook/useAuto";
import { useReplayModuleToSubmit } from "hook/useMessage";
import { AutoRequestType } from "types/utils";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";

import style from "./index.module.scss";

export const BlogContentReplayModule = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  request,
  toPrimary = 0,
}: {
  props: T;
  toPrimary?: number;
  request: AutoRequestType;
}) => {
  const { bool, switchBoolDebounce } = useBool();
  const imgRef = useAutoLoadCheckCodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });
  const { input1, input2, formRef, canSubmit, loading } = useReplayModuleToSubmit<T, HTMLTextAreaElement, HTMLInputElement>({
    isMd: Number(bool),
    props,
    request,
    toPrimary,
  });

  return (
    <form ref={formRef}>
      <button type="button" className={getClass("btn btn-sm btn-outline-info", flexCenter)} onClick={switchBoolDebounce}>
        {bool ? (
          <>
            <i className="ri-file-text-line" /> <span className="ml-2">go text</span>
          </>
        ) : (
          <>
            <i className="ri-markdown-line" /> <span className="ml-2">go markdown</span>
          </>
        )}
      </button>
      {bool ? (
        <BlogContentMessageMarkdownWithMemo className="my-2" name="content" forwardRef={input1} />
      ) : (
        <BlogContentMessageTextArea name="content" forwardRef={input1} />
      )}
      <div className={getClass("row px-3", flexBetween, style.checkCodeRow)}>
        <label htmlFor="putCheck" className="col-2 col-form-label text-truncate px-0" title="验证码">
          验证码:
        </label>
        <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
        <input name="checkCode" ref={input2} className="col-4 col-md-3 form-control" id="putCheck" />
        <Button className="btn-sm btn-primary" type="submit" loading={loading} disable={!canSubmit} value="新留言" />
      </div>
    </form>
  );
};
