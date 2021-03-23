import mergeWith from "lodash/mergeWith";
import { TagProps } from "types/containers";
import { BlogContentProps, TypeProps } from "types/hook";

const transformObjectValueToArray = (srcObject: { [props: string]: any }) => {
  const resObject: { [props: string]: any } = {};
  for (let key in srcObject) {
    if (Array.isArray(srcObject[key])) {
      resObject[key] = srcObject[key];
    } else {
      resObject[key] = [srcObject[key]];
    }
  }
  return resObject;
};

const mergeTypeTagToBlog = (blog: BlogContentProps, type: TypeProps[], tag: TagProps[]) => {
  const currentType = type.find((it) => Number(blog.typeId) === Number(it.typeId));
  const currentTagIds = String(blog.tagId).split(",").map(Number);
  const currentTagArray = tag.filter((it) => currentTagIds.includes(Number(it.tagId)));
  let currentTag;
  if (currentTagArray.length > 1) {
    const head = currentTagArray.pop();
    currentTag = mergeWith(head, ...currentTagArray, (res: TagProps[], srcValue: TagProps) => {
      if (!Array.isArray(res)) {
        res = [res];
      }
      return res.concat(srcValue);
    });
  } else {
    currentTag = transformObjectValueToArray(currentTagArray[0]);
  }
  return { ...blog, ...currentType, ...currentTag };
};

export { mergeTypeTagToBlog };
