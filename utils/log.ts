import chalk from "chalk";

const log = (message: string | Error, lev: "normal" | "warn" | "error") => {
  if (lev === "error") {
    if (!(process as any).browser) {
      if (message instanceof Error) {
        throw message;
      } else {
        throw new Error(message);
      }
    } else {
      console.log(`[${new Date().toISOString()}]`,chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(`[${new Date().toISOString()}]`, chalk.green(message.toString()));
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${new Date().toISOString()}]`, message);
    }
  }
};

export { log };
