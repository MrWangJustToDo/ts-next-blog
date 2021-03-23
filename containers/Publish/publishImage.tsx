import { ChangeEvent, useCallback, useState } from "react";
import { getClass } from "utils/class";
import { useInputToImageModule } from "hook/useBlog";
import PublishImageModule from "./publishImageModule";
import { SimpleElement } from "types/components";

import style from "./index.module.scss";

let PublishImage: SimpleElement;

PublishImage = () => {
  const [val, setVal] = useState<string>("");
  const click = useInputToImageModule({
    appendHandler: setVal,
    body: (appendHandler) => (closeHandler) => <PublishImageModule closeHandler={closeHandler} appendHandler={appendHandler} />,
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
      <input type="text" value={val} onChange={typeClick} name="blogImgLink" className="form-control shadow-none" placeholder="文章首图" />
    </div>
  );
};

export default PublishImage;
