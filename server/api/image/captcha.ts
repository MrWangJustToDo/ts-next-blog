import svgCaptcha from "svg-captcha";
import { success, autoRequestHandler } from "server/middleware/apiHandler";

// 获取验证码图片
const getCaptchaAction = autoRequestHandler({
  requestHandler: ({ req, res }) => {
    const captcha = svgCaptcha.create({
      noise: 4,
      background: "#ffffff",
    });
    req.session.captcha = captcha.text;
    res.type("svg");
    res.send(captcha.data);
  },
});

// 获取验证码明文
const getCaptchaStrAction = autoRequestHandler({
  requestHandler: ({ req, res }) => {
    success({ res, resDate: { data: req.session.captcha } });
  },
});

export { getCaptchaAction, getCaptchaStrAction };
