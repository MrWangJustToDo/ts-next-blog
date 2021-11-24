import express, { Express } from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";

const setUp = (expressApp: Express) => {
  expressApp.use(
    express.static(`${process.cwd()}/public`, {
      maxAge: 365 * 24 * 3600000,
    })
  );

  expressApp.use(express.json({ limit: "5mb" }));

  expressApp.use(express.urlencoded({ extended: true }));

  expressApp.use(cookieParser(process.env.COOKIE_PARSER));

  expressApp.use(
    cors({
      maxAge: 86400,
      origin: "*",
    })
  );
  expressApp.use(
    session({
      secret: "keyboard cat",
      resave: true,
      rolling: true,
      saveUninitialized: true,
      cookie: { maxAge: 600000 },
      name: "react-next-blog",
    })
  );
};

export { setUp };
