import http from "http";
import next from "next";
import express from "express";
import { log } from "utils/log";
import { setUp } from "./setup";
import { init } from "./init";
import { apiHandler } from "./api";
import { detectionToken, generateToken } from "./check";

require("dotenv").config();

const port = process.env.PORT;

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

const handle = nextApp.getRequestHandler();

const app = express();

setUp(app);

init(app);

app.use("/api", detectionToken);

app.use(generateToken);

app.use("/api", apiHandler);

nextApp.prepare().then(() => {
  app.all("*", (req, res) => {
    return handle(req, res);
  });
  http.createServer(app).listen(port, () => log(`=== app run on: http://localhost:${port} ===`, "warn"));
});
