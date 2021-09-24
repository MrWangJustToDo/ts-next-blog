import { apiName } from "config/api";
import Button from "components/Button";
import { BlogContentMessageTextArea } from "./blogContentMessagePut";
import BlogContentMessageMarkdown from "./blogContentMessageMarkdown";
import { flexBetween, getClass } from "utils/dom";
import { useAutoLoadCheckCodeImg } from "hook/useAuto";
import { useUpdateModuleToSubmit } from "hook/useMessage";
import { ChildMessageProps, PrimaryMessageProps } from "types/components";
import { BlogContentUpdateModuleProps, BlogContentUpdateModuleType, BlogContentUpdateModuleWithImageType, WithImgRef } from "types/containers";

import style from "./index.module.scss";

const BlogContentUpdateModuleWithImg: BlogContentUpdateModuleWithImageType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  imgRef,
  request,
  closeHandler,
}: BlogContentUpdateModuleProps<T> & WithImgRef) => {
  const { input1, input2, formRef, loading, canSubmit } = useUpdateModuleToSubmit<T, HTMLTextAreaElement, HTMLInputElement>({ request, props, closeHandler });

  return (
    <form ref={formRef}>
      {props.isMd ? (
        <BlogContentMessageMarkdown className="my-2" name="newContent" defaultValue={props.content} forwardRef={input1} />
      ) : (
        <BlogContentMessageTextArea name="newContent" defaultValue={props.content} forwardRef={input1} />
      )}
      <div className={getClass("row px-3", flexBetween, style.checkCodeRow)}>
        <label htmlFor="putCheck" className="col-2 col-form-label text-truncate px-0" title="验证码">
          验证码:
        </label>
        <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
        <input name="checkCode" ref={input2} className="col-4 col-md-3 form-control" id="putCheck" />
        <Button className="btn-sm btn-primary" type="submit" value="更新" loading={loading} disable={!canSubmit} />
      </div>
    </form>
  );
};

const BlogContentUpdateModule: BlogContentUpdateModuleType = <T extends PrimaryMessageProps | ChildMessageProps>({
  props,
  request,
  closeHandler,
}: BlogContentUpdateModuleProps<T>) => {
  const imgRef = useAutoLoadCheckCodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });

  return <BlogContentUpdateModuleWithImg request={request} closeHandler={closeHandler} imgRef={imgRef} props={props} />;
};

export default BlogContentUpdateModule;
