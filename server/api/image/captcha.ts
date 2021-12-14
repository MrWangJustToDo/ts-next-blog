import svgCaptcha from "svg-captcha";
import { catchMiddlewareHandler, compose, defaultRunRequestMiddleware, success, wrapperMiddlewareRequest } from "server/middleware/apiHandler";

// 获取验证码图片
const getCaptchaAction = wrapperMiddlewareRequest(
  {
    requestHandler: async function getCaptchaAction({ req, res }) {
      const captcha = svgCaptcha.create({
        noise: 4,
        background: "#ffffff",
      });
      req.session.captcha = captcha.text;
      res.type("svg");
      res.send(captcha.data);
    },
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

// 获取验证码明文
const getCaptchaStrAction = wrapperMiddlewareRequest(
  {
    requestHandler: function getCaptchaStrAction({ req, res }) {
      success({ res, resDate: { data: req.session.captcha } });
    },
  },
  compose(catchMiddlewareHandler, defaultRunRequestMiddleware)
);

export { getCaptchaAction, getCaptchaStrAction };
