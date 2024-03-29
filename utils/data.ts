import { ApiRequestResult, AutoTransformDataType, FormChild, FormSerializeType, GetCurrentAvatar, ResultProps } from "types/utils";

const autoTransformData: AutoTransformDataType = <T extends any, F extends any>(data: ResultProps<T, F>) => {
  if (data.code !== undefined && data.state && data.data) {
    return (<ApiRequestResult<T>>data).data;
  } else {
    return <F>data;
  }
};

const getCurrentAvatar: GetCurrentAvatar = (avatar, gender) => {
  if (avatar && avatar.length > 0) {
    return avatar;
  } else {
    if (gender === undefined || gender === null) {
      return process.env.NEXT_PUBLIC_MAN as string;
    }
    if (gender === 0) {
      return process.env.NEXT_PUBLIC_MAN as string;
    } else {
      return process.env.NEXT_PUBLIC_WOMEN as string;
    }
  }
};

/*
{
  from form field
  blogCommentState: 0
  blogContent: null
  blogImgLink: "https://cn.bing.com/th?id=OHR.WesterheverLight_ZH-CN6827035695_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"
  blogOriginState: 0
  blogPriseState: 0
  blogState: 0
  blogTitle: null
  tagId: null
  typeId: null
}
*/
const formSerialize: FormSerializeType = (element: HTMLFormElement) => {
  const re: { [props: string]: null | string | Array<string> } = {};
  const arr = ["button", "file", "reset", "submit"];
  if (element.localName === "form") {
    const inputs = Array.from<FormChild>(element.elements);
    inputs.forEach((item) => {
      if (item.name && item.type) {
        re[item.name] = null;
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

const parseToString = (obj: { [props: string]: any } | Array<any> | string | number, preString: string = ""): string => {
  let re = "";
  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      re += preString + "[\n";
      obj.forEach((item) => {
        re += preString + parseToString(item, preString + "".padEnd(2)) + "\n";
      });
      re += preString + "]\n";
    } else {
      for (let key in obj) {
        re += preString + "{\n";
        re += parseToString(key, preString + "".padEnd(1)) + ":" + parseToString(obj[key], preString + "".padEnd(2)) + "\n";
        re += preString + "}\n";
      }
    }
    return re;
  } else {
    return preString + obj;
  }
};

interface Point {
  clientX: number;
  clientY: number;
}

const pinchHelper = {
  isPointerEvent: (event: any): event is PointerEvent => self.PointerEvent && event instanceof PointerEvent,
  getDistance: (a: Point, b?: Point): number => {
    if (!b) return 0;
    return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
  },
  getMidpoint: (a: Point, b?: Point): Point => {
    if (!b) return a;
    return {
      clientX: (a.clientX + b.clientX) / 2,
      clientY: (a.clientY + b.clientY) / 2,
    };
  },
  getAbsoluteValue: (value: string | number, max: number): number => {
    if (typeof value === "number") return value;

    if (value.trimEnd().endsWith("%")) {
      return (max * parseFloat(value)) / 100;
    }
    return parseFloat(value);
  },
  createMatrix: () => new DOMMatrix(),
  createPoint: () => new DOMPoint(),
};

const transformFromFieldToBlog = (props: ReturnType<FormSerializeType>) => {
  const {
    blogOriginState: originalBlogOriginState,
    tagId: originalTagId,
    blogState: originalBlogState,
    blogPriseState: originalBlogPriseState,
    blogCommentState: originalBlogCommentState,
    ...resProps
  } = props;
  const tagId = typeof originalTagId === "string" ? originalTagId.split(",") : originalTagId;
  const blogState = Number(originalBlogState);
  const blogOriginState = Number(originalBlogOriginState);
  const blogPriseState = Number(originalBlogPriseState === "on");
  const blogCommentState = Number(originalBlogCommentState === "on");
  return { ...resProps, tagId, blogState, blogOriginState, blogPriseState, blogCommentState };
};

export { autoTransformData, getCurrentAvatar, formSerialize, getRandom, parseToString, pinchHelper, transformFromFieldToBlog };
