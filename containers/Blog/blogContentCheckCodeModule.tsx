import { apiName } from "config/api";
import { Button } from "components/Button";
import { flexCenter, getClass } from "utils/dom";
import { useAutoLoadCheckCodeImg } from "hook/useAuto";
import { useCheckCodeModuleToSubmit } from "hook/useMessage";
import { BlogProps } from "types";
import { AutoRequestType } from "types/utils";

export const BlogContentCheckCodeModule = ({
  blogId,
  request,
  closeHandler,
  requestCallback,
}: {
  blogId: BlogProps["blogId"];
  request: AutoRequestType;
  closeHandler: () => void;
  requestCallback: () => void;
}) => {
  const imgRef = useAutoLoadCheckCodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });
  const { formRef, inputRef, loading, canSubmit } = useCheckCodeModuleToSubmit({ request, closeHandler, requestCallback, blogId });

  return (
    <form ref={formRef} className={getClass("row", flexCenter)}>
      <label htmlFor="putCheck" className="col-2 col-form-label text-left px-0 text-truncate" title="验证码">
        验证码:
      </label>
      <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
      <div className="col-4">
        <input name="checkCode" className="form-control" id="putCheck" ref={inputRef} />
      </div>
      <Button className="btn-sm btn-outline-info" type="submit" loading={loading} disable={!canSubmit}>
        提交
      </Button>
    </form>
  );
};
