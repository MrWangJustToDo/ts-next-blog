import { apiName } from "config/api";
import Button from "components/Button";
import { BlogContentMessageTextArea } from "./blogContentMessagePut";
import BlogContentMessageMarkdown from "./blogContentMessageMarkdown";
import { flexBetween, flexCenter, getClass } from "utils/dom";
import { useBool } from "hook/useData";
import { useAutoLoadCheckcodeImg } from "hook/useAuto";
import { useReplayModuleToSubmit } from "hook/useMessage";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";
import { BlogContentReplayModuleProps, BlogContentReplayModuleType, BlogContentReplayModuleWithImageType, WithImgRef } from "types/containers";

import style from "./index.module.scss";

const BlogContentReplayModuleWithImag: BlogContentReplayModuleWithImageType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  imgRef,
  request,
  closeHandler,
}: BlogContentReplayModuleProps<T> & WithImgRef) => {
  const { bool, switchBoolDebounce } = useBool();
  const { input1, input2, formRef, canSubmit, loading } = useReplayModuleToSubmit<T, HTMLTextAreaElement, HTMLInputElement>({
    isMd: Number(bool),
    props,
    request,
    closeHandler,
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
        <BlogContentMessageMarkdown className="my-2" name="content" forwardRef={input1} />
      ) : (
        <BlogContentMessageTextArea name="content" forwardRef={input1} />
      )}
      <div className={getClass("row px-3", flexBetween, style.checkcodeRow)}>
        <label htmlFor="putcheck" className="col-2 col-form-label text-truncate px-0" title="验证码">
          验证码:
        </label>
        <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
        <input name="checkCode" ref={input2} className="col-4 col-md-3 form-control" id="putcheck" />
        <Button className="btn-sm btn-primary" type="submit" loading={loading} disable={!canSubmit} value="新留言" />
      </div>
    </form>
  );
};

const BlogContentReplayModule: BlogContentReplayModuleType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  request,
  closeHandler,
}: BlogContentReplayModuleProps<T>) => {
  const imgRef = useAutoLoadCheckcodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });

  return <BlogContentReplayModuleWithImag request={request} closeHandler={closeHandler} imgRef={imgRef} props={props} />;
};

export default BlogContentReplayModule;
