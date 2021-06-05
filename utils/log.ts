import chalk from "chalk";
import PrettyError from "pretty-error";

const pre = new PrettyError();

const log = (message: string | Error, lev: "normal" | "warn" | "error") => {
  const side = (process as any).browser ? "client" : "server";
  if (lev === "error") {
    if (side === "server") {
      if (message instanceof Error) {
        console.log(`[${side}]`, pre.render(message));
      } else {
        console.log(`[${side}]`, pre.render(new Error(message)));
      }
    } else {
      console.log(`[client]`, chalk.red(message.toString()));
    }
  } else if (lev === "warn") {
    console.log(`[${side}]`, chalk.green(message.toString()));
  } else {
    if (process.env.NODE_ENV === "development") {
      console.log(`[${side}]`, message.toString());
    }
  }
};

export { log };
