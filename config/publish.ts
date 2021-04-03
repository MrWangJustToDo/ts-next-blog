import { BlogOriginProps, BlogStateType } from "types/config";

let blogOrigin: BlogOriginProps;
let blogState: BlogStateType;
let editorId: string;

blogOrigin = [
  {
    name: "原创",
    value: "0",
  },
  {
    name: "翻译",
    value: "1",
  },
  {
    name: "转载",
    value: "2",
  },
];

blogState = [
  {
    fieldName: "blogState",
    name: "状态",
    value: [
      {
        name: "暂存",
        value: "0",
      },
      {
        name: "隐藏",
        value: "1",
      },
      {
        name: "发布",
        value: "2",
      },
      {
        name: "推荐",
        value: "3",
      },
    ],
  },
  {
    fieldName: "blogPriseState",
    name: "打赏",
    value: "1",
  },
  {
    fieldName: "blogCommentState",
    name: "评论",
    value: "1",
  },
];

editorId = "blogEditor";

export { blogOrigin, blogState, editorId };
