import { apiName } from "config/api";
import Button from "components/Button";
import { flexCenter, getClass } from "utils/dom";
import { useAutoLoadCheckcodeImg } from "hook/useAuto";
import { useCheckcodeModuleToSubmit } from "hook/useMessage";
import { BlogContentCheckcodeModuleWithImageType, BlogContentCheckcodeModuleType } from "types/containers";

const BlogContentCheckcodeModuleWithImag: BlogContentCheckcodeModuleWithImageType = ({ blogId, request, closeHandler, imgRef, requestCallback }) => {
  const { ref, submit, canSubmit } = useCheckcodeModuleToSubmit<HTMLInputElement>({ request, closeHandler, requestCallback, blogId });

  return (
    <div className={getClass("row", flexCenter)}>
      <label htmlFor="putcheck" className="col-2 col-form-label text-left px-0 text-truncate" title="验证码">
        验证码:
      </label>
      <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
      <div className="col-4">
        <input className="form-control" id="putcheck" ref={ref} />
      </div>
      <Button className="btn-sm btn-outline-info" request={submit} disable={!canSubmit} value={"提交"} />
    </div>
  );
};

const BlogContentCheckcodeModule: BlogContentCheckcodeModuleType = ({ blogId, request, closeHandler, requestCallback }) => {
  const imgRef = useAutoLoadCheckcodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });

  return <BlogContentCheckcodeModuleWithImag imgRef={imgRef} blogId={blogId} request={request} requestCallback={requestCallback} closeHandler={closeHandler} />;
};

export default BlogContentCheckcodeModule;
