import { apiName } from "config/api";
import Button from "components/Button";
import { flexCenter, getClass } from "utils/dom";
import { useAutoLoadCheckcodeImg } from "hook/useAuto";
import { useCheckcodeModuleToSubmit } from "hook/useMessage";
import { BlogContentCheckcodeModuleWithImageType, BlogContentCheckcodeModuleType } from "types/containers";

const BlogContentCheckcodeModuleWithImag: BlogContentCheckcodeModuleWithImageType = ({ blogId, request, closeHandler, imgRef, requestCallback }) => {
  const { formRef, inputRef, loading, canSubmit } = useCheckcodeModuleToSubmit({ request, closeHandler, requestCallback, blogId });

  return (
    <form ref={formRef} className={getClass("row", flexCenter)}>
      <label htmlFor="putcheck" className="col-2 col-form-label text-left px-0 text-truncate" title="验证码">
        验证码:
      </label>
      <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
      <div className="col-4">
        <input name="checkCode" className="form-control" id="putcheck" ref={inputRef} />
      </div>
      <Button className="btn-sm btn-outline-info" type="submit" loading={loading} disable={!canSubmit}>
        提交
      </Button>
    </form>
  );
};

const BlogContentCheckcodeModule: BlogContentCheckcodeModuleType = ({ blogId, request, closeHandler, requestCallback }) => {
  const imgRef = useAutoLoadCheckcodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });

  return <BlogContentCheckcodeModuleWithImag imgRef={imgRef} blogId={blogId} request={request} requestCallback={requestCallback} closeHandler={closeHandler} />;
};

export default BlogContentCheckcodeModule;
