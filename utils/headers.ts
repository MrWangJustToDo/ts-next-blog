import Cookies from "js-cookie";
import { GetHeaderType, HeaderProps } from "types/utils";

const getHeader: GetHeaderType = (header = {}) => {
  const resultHeader: HeaderProps = {};
  for (let key in header) {
    if (header[key] === true) {
      resultHeader[key] = Cookies.get(`${key}`) || "";
    } else {
      resultHeader[key] = header[key];
    }
  }
  return resultHeader;
};

export { getHeader };
