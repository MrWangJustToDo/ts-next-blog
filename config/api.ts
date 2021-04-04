import { AccessType } from "types/config";

// 请求配置
enum apiName {
  // 首页信息
  home = "home", // 获取home页面数据
  userHome = "userHome", // 当前用户的所有数据
  userEx = "userEx", // 获取用户信息数据
  user = "user", // 获取用户详细数据
  type = "type", // 获取type页面数据apiName
  tag = "tag", // 获取tag页面数据apiName
  // 用户信息
  login = "login", // 登录
  logout = "logout", // 登出
  register = "register", // 注册
  autoLogin = "autoLogin", // 自动登录
  // 图片信息
  image = "image", // 获取图片
  captcha = "captcha", // 获取验证码图片
  captchaStr = "captchaStr", // 获取验证码文本
  // 博客信息
  blog = "blog", // 获取blog详情
  childMessage = "childMessage", // 获取次要留言信息
  primaryMessage = "primaryMessage", // 获取主要留言信息
  putChildMessage = "putChildMessage", // 发布次要评论
  putPrimaryMessage = "putPrimaryMessage", // 发布主要评论
  // 管理信息
  search = "search", // 搜索博客
  updataBlog = "updateBlog", // 更新博客信息
  publishBlog = "publishBlog", // 发布博客信息
  addTag = "addTag", // 添加tag
  addType = "addType", // 添加Type
  checkTag = "checkTag", // 检测Tag
  checkType = "checkType", // 检测Type
  deleteTag = "deleteTag", // 删除Tag
  deleteType = "deleteType", // 删除Type
  deleteBlog = "deleteBlog", // 删除blog
  // test
  testTag = "testTag",
  testChild = "testChild",
  testType = "testType",
  testUserEx = "testUserEx",
  testPrimary = "testPrimary",
  testBlog = "testBlog",
  testHome = "testHome",
  testUser = "testUser",
}

// 需要暂存结果的路径
const cacheApi = [apiName.home, apiName.userEx, apiName.user, apiName.type, apiName.tag, apiName.blog];

// 响应配置
const accessApi: AccessType = {
  // 用户信息
  [apiName.autoLogin]: { disable: false },
  [apiName.login]: { disable: false, token: false, method: "post" },
  [apiName.logout]: { disable: false, token: false },
  [apiName.register]: { disable: false, token: false, method: "post" },
  // 图片信息
  [apiName.image]: { disable: false, token: false },
  [apiName.captcha]: { disable: false, token: false },
  [apiName.captchaStr]: { disable: false, token: false },
  // 首页信息
  [apiName.home]: { disable: false, token: false, config: { cache: { needCache: true } } },
  [apiName.userHome]: { disable: false, token: true },
  [apiName.user]: { disable: false, token: false },
  [apiName.userEx]: { disable: false, token: true },
  [apiName.tag]: { disable: false, token: false },
  [apiName.type]: { disable: false, token: false },
  // 博客信息
  [apiName.blog]: { disable: false, token: false, config: { cache: { needCache: true } } },
  [apiName.childMessage]: { disable: false, token: false },
  [apiName.primaryMessage]: { disable: false, token: false },
  [apiName.putChildMessage]: { disable: false, token: false, method: "post" },
  [apiName.putPrimaryMessage]: { disable: false, token: false, method: "post" },
  // 管理信息
  [apiName.search]: { disable: false, token: true, method: "post" },
  [apiName.addTag]: { disable: false, token: false, method: "post" },
  [apiName.addType]: { disable: false, token: false, method: "post" },
  [apiName.checkTag]: { disable: false, token: false, method: "post" },
  [apiName.checkType]: { disable: false, token: false, method: "post" },
  [apiName.deleteTag]: { disable: false, token: false, method: "delete" },
  [apiName.deleteType]: { disable: false, token: false, method: "delete" },
  [apiName.deleteBlog]: { disable: false, token: true, method: "delete" },
  [apiName.updataBlog]: { disable: false, token: true, method: "post" },
  [apiName.publishBlog]: { disable: false, token: true, method: "post" },
};

export { apiName, cacheApi, accessApi };
