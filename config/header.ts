import { HeaderContentType } from "types/config";

const HeaderContent: HeaderContentType = [
  { value: "首页", hrefTo: "/", icon: "ri-home-heart-fill" },
  { value: "分类", hrefTo: "/type", icon: "ri-lightbulb-flash-fill" },
  { value: "标签", hrefTo: "/tag", icon: "ri-price-tag-fill" },
  { value: "归档", hrefTo: "/archive", icon: "ri-archive-drawer-fill" },
  { value: "关于我", hrefTo: "/about", icon: "ri-information-fill" },
];

export default HeaderContent;
