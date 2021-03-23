import { flexBetween, getClass } from "utils/class";
import { FootPageType } from "types/components";

let FootPage: FootPageType;

FootPage = ({ page, increaseAble, decreaseAble, increasePage, decreasePage, className = "" }) => {
  return (
    <div className={getClass("card-footer bg-transparent", flexBetween, className)}>
      <button disabled={!decreaseAble} onClick={decreasePage} className="btn btn-sm btn-outline-info">
        前一页
      </button>
      <span className="text-info">{page}</span>
      <button disabled={!increaseAble} onClick={increasePage} className="btn btn-sm btn-outline-info">
        后一页
      </button>
    </div>
  );
};

export default FootPage;
