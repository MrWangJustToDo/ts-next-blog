import { RefObject, useCallback } from "react";
import { getClass } from "utils/dom";
import { useInputToImageModule } from "hook/useBlog";
import { PublishImageModule } from "./publishImageModule";
import { BlogProps } from "types";

import style from "./index.module.scss";

export const PublishImage = ({ blogImgLink }: Partial<Pick<BlogProps, "blogImgLink">>) => {
  const body = useCallback<(ref: RefObject<HTMLInputElement>) => (closeHandler: () => void) => JSX.Element>(
    (ref) => (closeHandler) => {
      const WithImage = <PublishImageModule closeHandler={closeHandler} inputRef={ref} initialUrl={blogImgLink} />;
      return WithImage;
    },
    [blogImgLink]
  );

  const [inputRef, click] = useInputToImageModule({
    body,
  });

  return (
    <div className="input-group mb-3 position-relative">
      <div className="input-group-prepend text-center">
        <span
          className="d-inline-block input-group-text bg-transparent border-info text-info position-relative font-weight-bold"
          style={{ zIndex: 12, minWidth: "60px" }}
        >
          首图
        </span>
      </div>
      <button type="button" className={getClass("position-absolute btn btn-info btn-sm", style.btn)} onClick={click}>
        选择图片
      </button>
      <input ref={inputRef} type="text" defaultValue={blogImgLink} name="blogImgLink" className="form-control shadow-none" placeholder="文章首图" />
    </div>
  );
};
