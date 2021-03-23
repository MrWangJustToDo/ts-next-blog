import svgCaptcha from "svg-captcha";
import { catchHandler, transformHandler, fail, success } from "server/middleware/apiHandler";

// 获取验证码图片
const getCaptchaAction = transformHandler(
  catchHandler(
    ({ req, res }) => {
      const captcha = svgCaptcha.create({
        noise: 4,
        background: "#ffffff",
      });
      req.session.captcha = captcha.text;
      res.type("svg");
      res.send(captcha.data);
    },
    ({ res, e, code = 500 }) => fail({ res, statuCode: code, resDate: { data: e.toString(), methodName: "getCaptchaAction" } })
  )
);

// 获取验证码明文
const getCaptchaStrAction = transformHandler(
  catchHandler(
    ({ req, res }) => {
      success({ res, resDate: { data: req.session.captcha } });
    },
    ({ res, e }) => fail({ res, resDate: { data: e.toString() } })
  )
);

export { getCaptchaAction, getCaptchaStrAction };
