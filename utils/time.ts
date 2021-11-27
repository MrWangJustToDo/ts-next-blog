import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import calendarPlugin from "dayjs/plugin/calendar";
import { log } from "./log";
import type { TimeToString } from "types/utils";

dayjs.locale("zh-cn");
dayjs.extend(relativeTime);
dayjs.extend(calendarPlugin);

const momentTo: TimeToString = (time) => {
  if (typeof time === "string") {
    time = new Date(time);
  }
  if (time instanceof Date) {
    return dayjs(new Date()).to(dayjs(time));
  } else {
    log(`time parameter error : ${time}`, "error");
    return dayjs().toNow();
  }
};

const calendar: TimeToString = (time) => {
  if (typeof time === "string") {
    time = new Date(time);
  }
  if (time instanceof Date) {
    return dayjs(time).calendar();
  } else {
    return dayjs(new Date()).calendar();
  }
};

export { momentTo, calendar };
