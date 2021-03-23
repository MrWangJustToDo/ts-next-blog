import { MainRightHeader } from "types/config";

// 每一页显示的内容数量
export const pageContentLength = 4;

// home 每一项下方的显示配置，依次为：作者头像，赞，收藏，观看
enum mainRight {
  type,
  tag,
  recommend,
}

let mainRightHeader: MainRightHeader;

mainRightHeader = {
  [mainRight.type]: { icon: "ri-lightbulb-flash-fill", content: "分类", hrefTo: "/type" },
  [mainRight.tag]: { icon: "ri-price-tag-3-fill", content: "标签", hrefTo: "/tag" },
  [mainRight.recommend]: { icon: "ri-bookmark-fill", content: "推荐" },
};

export { mainRightHeader, mainRight };
