import { apiName } from "config/api";
import Button from "components/Button";
import { flexCenter, getClass } from "utils/class";
import { useAutoLoadCheckcodeImg } from "hook/useAuto";
import { useCheckcodeModuleToSubmit } from "hook/useMessage";
import { BlogContentCheckcodeModuleWithImagType, BlogContentCheckcodeModuleType } from "types/containers";

let BlogContentCheckcodeModule: BlogContentCheckcodeModuleType;

let BlogContentCheckcodeModuleWithImag: BlogContentCheckcodeModuleWithImagType;

BlogContentCheckcodeModuleWithImag = ({ request, closeHandler, imgRef }) => {
  const { ref, submit, canSubmit } = useCheckcodeModuleToSubmit<HTMLInputElement>({ request, closeHandler });
  return (
    <div className={getClass("row", flexCenter)}>
      <label htmlFor="putcheck" className="col-2 col-form-label text-center text-truncate" title="验证码">
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

BlogContentCheckcodeModule = ({ request, closeHandler }) => {
  const imgRef = useAutoLoadCheckcodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });
  return <BlogContentCheckcodeModuleWithImag request={request} closeHandler={closeHandler} imgRef={imgRef} />;
};

export default BlogContentCheckcodeModule;
