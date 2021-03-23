import { imageHandler } from "./image";
import { homeHandler } from "./home";
import { tagHandler } from "./tag";
import { typeHandler } from "./type";
import { userHandler } from "./user";
import { messageHandler } from "./message";
import { blogHandler } from "./blog";
import { fail } from "server/middleware/apiHandler";
import { Request, Response } from "express";

// const { testHandler } = require("./test");

const allHandler: {[props: string]: Function} = {
  ...imageHandler,
  ...homeHandler,
  ...tagHandler,
  ...typeHandler,
  ...userHandler,
  ...blogHandler,
  ...messageHandler,
  // ...testHandler,
};

const apiHandler = async (req: Request, res: Response) => {
  let action = allHandler[req.path.slice(1)];
  if (action) {
    await action(req, res);
  } else {
    // 其他api访问转向next api router
    // next();
    fail({ res, resDate: { state: "api路径不正确", data: `请求: ${req.path}` } });
  }
};

export { apiHandler };
