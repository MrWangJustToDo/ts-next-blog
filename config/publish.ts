import { BlogOriginProps, BlogStateType } from "types/config";

const blogOrigin: BlogOriginProps = [
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

const blogState: BlogStateType = [
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

const editorId = "blogEditor";

export { blogOrigin, blogState, editorId };
