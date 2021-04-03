import { ChangeEvent, RefObject, useCallback, useRef, useState } from "react";
import { getClass } from "utils/class";
import { useInputToImageModule } from "hook/useBlog";
import PublishImageModule from "./publishImageModule";
import { BlogContentType } from "types/containers";

import style from "./index.module.scss";

let PublishImage: BlogContentType;

PublishImage = ({ blogImgLink }) => {
  const ref = useRef<HTMLInputElement>(null);

  const [val, setVal] = useState<string>(blogImgLink || "");

  const body = useCallback<(appendHandler: (props: string) => void) => (ref: RefObject<HTMLInputElement>) => (closeHandler: () => void) => JSX.Element>(
    (appendHandler) => (ref) => (closeHandler) => <PublishImageModule closeHandler={closeHandler} appendHandler={appendHandler} inputRef={ref} />,
    []
  );

  const click = useInputToImageModule({
    inputRef: ref,
    appendHandler: setVal,
    body,
  });

  const typeClick = useCallback<(e: ChangeEvent<HTMLInputElement>) => void>((e) => setVal(e.target.value), []);

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
      <input ref={ref} type="text" value={val} onChange={typeClick} name="blogImgLink" className="form-control shadow-none" placeholder="文章首图" />
    </div>
  );
};

export default PublishImage;
