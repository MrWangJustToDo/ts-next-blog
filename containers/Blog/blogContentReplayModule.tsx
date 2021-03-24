import { apiName } from "config/api";
import Button from "components/Button";
import { flexBetween, getClass } from "utils/class";
import { useAutoLoadCheckcodeImg } from "hook/useAuto";
import { useReplayModuleToSubmit } from "hook/useMessage";
import { BlogContentReplayModuleType, BlogContentReplayModuleWithImagType } from "types/containers";

import style from "./index.module.scss";

let BlogContentReplayModule: BlogContentReplayModuleType;

let BlogContentReplayModuleWithImag: BlogContentReplayModuleWithImagType;

BlogContentReplayModuleWithImag = ({ request, closeHandler, imgRef }) => {

  const { input1, input2, submit, canSubmit } = useReplayModuleToSubmit<HTMLTextAreaElement, HTMLInputElement>({ request, closeHandler });
  
  return (
    <>
      <textarea className="w-100 my-2 border rounded" placeholder="请输入留言" style={{ minHeight: "100px" }} ref={input1} />
      <div className={getClass("row px-3", flexBetween, style.checkcodeRow)}>
        <label htmlFor="putcheck" className="col-2 col-form-label text-truncate" title="验证码">
          验证码:
        </label>
        <img ref={imgRef} className="col-4 col-md-3 border rounded" height="38" alt="验证码" />
        <input ref={input2} className="col-4 col-md-3 form-control" id="putcheck" />
        <Button className="btn-sm btn-primary" request={submit} disable={!canSubmit} value="新留言" />
      </div>
    </>
  );
};

BlogContentReplayModule = ({ request, closeHandler }) => {

  const imgRef = useAutoLoadCheckcodeImg({ imgUrl: apiName.captcha, strUrl: apiName.captchaStr });

  return <BlogContentReplayModuleWithImag request={request} closeHandler={closeHandler} imgRef={imgRef} />;
};

export default BlogContentReplayModule;
