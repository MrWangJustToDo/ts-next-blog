import { ApiRequestResult, AutoTransformDataType, FormChild, FormSerializeType, GetCurrentAvatar, ResultProps } from "types/utils";

let autoTransformData: AutoTransformDataType;

let getCurrentAvatar: GetCurrentAvatar;

let formSerialize: FormSerializeType;

autoTransformData = <T, F>(data: ResultProps<T, F>) => {
  if (data.code !== undefined && data.state && data.data) {
    return (<ApiRequestResult<T>>data).data;
  } else {
    return <F>data;
  }
};

getCurrentAvatar = (avatar, gender) => {
  if (avatar && avatar.length > 0) {
    return avatar;
  } else {
    if (gender === undefined) {
      return process.env.NEXT_PUBLIC_MAN as string;
    }
    if (gender === 0) {
      return process.env.NEXT_PUBLIC_MAN as string;
    } else {
      return process.env.NEXT_PUBLIC_WOMEN as string;
    }
  }
};

formSerialize = (element: HTMLFormElement) => {
  const re: { [props: string]: string | Array<string> } = {};
  const arr = ["button", "file", "reset", "submit"];
  if (element.localName === "form") {
    const inputs = Array.from<FormChild>(element.elements);
    inputs.forEach((item) => {
      if (item.name && item.type) {
        if (!arr.includes(item.type)) {
          if (item.type === "radio") {
            if ((item as HTMLInputElement).checked && item.value) {
              re[item.name] = item.value;
            }
          } else if (item.type === "checkbox") {
            if ((item as HTMLInputElement).checked && item.name && item.value) {
              if (item.name in re) {
                (re[item.name] as Array<string>).push(item.value);
              } else {
                re[item.name] = [item.value];
              }
            }
          } else if (item.localName === "select") {
            const selectItems = (item as HTMLSelectElement).selectedOptions;
            if ((item as HTMLSelectElement).multiple) {
              re[item.name] = [];
              Array.from(selectItems).forEach((selectItem) => {
                if (!selectItem.disabled && item.name) {
                  (re[item.name] as Array<string>).push(selectItem.value);
                }
              });
            } else {
              Array.from(selectItems).forEach((selectItem) => {
                if (!selectItem.disabled && item.name) {
                  re[item.name] = selectItem.value;
                }
              });
            }
          } else {
            if (!item.disabled && item.value) {
              re[item.name] = item.value;
            }
          }
        }
      }
    });
  } else {
    throw new Error(`FormSerialize parameter type error`);
  }
  return re;
};

const getRandom = (start: number, end?: number): number => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return ((Math.random() * (end - start + 1)) | 0) + start;
};

const parseToString = (obj: { [props: string]: any } | Array<any> | string | number, indent: number = 0): string => {
  let re = "";
  if (Array.isArray(obj)) {
    re = "".padEnd(indent) + "[\n";
    re += "".padEnd(indent + 2) + obj.map((it) => typeof it === 'object' ? parseToString(it, indent + 2) : it.toString()).join(",\n");
    re += "".padEnd(indent) + "]\n";
  } else if (typeof obj === "object") {
    re = "".padEnd(indent) + "{\n";
    for (let key in obj) {
      re += "".padEnd(indent + 2) + `${key}: ${typeof obj[key] === 'object' ? parseToString(obj[key], indent + 2) : obj[key].toString()},\n`;
    }
    re = "".padEnd(indent) + re.slice(0, -1) + "}\n";
  } else {
    re = "".padEnd(indent) + obj.toString();
  }
  return re;
};

export { autoTransformData, getCurrentAvatar, formSerialize, getRandom, parseToString };