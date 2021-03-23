import chalk from "chalk";

if (!(process as any).browser) {
  const PrettyError = require("pretty-error");
  var pre = new PrettyError();
}

const log = (message: string | Error, lev: "normal" | "warn" | "error") => {
  if (lev === "error") {
    if (!(process as any).browser) {
      console.log(pre.render(message));
    } else {
      console.log(chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(chalk.green(message.toString()));
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(message);
    }
  }
};

export { log };
