import { FootContentType } from "types/config";

const footContentLength = 2;

const footRecommendContent: FootContentType = [
  { content: "MDN", hrefTo: "https://dev.mozilla.org/", column: 1 },
  { content: "Next.js", hrefTo: "https://nextjs.org/", column: 1 },
];

const footContactMe: FootContentType = [
  { head: "qq", content: "2711470541", column: 2 },
  { head: "email", content: "2711470541@qq.com", column: 2 },
];

export { footContentLength, footRecommendContent, footContactMe };
