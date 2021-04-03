import mergeWith from "lodash/mergeWith";
import cloneDeep from 'lodash/cloneDeep';
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
  const currentTagArr = cloneDeep(tag);
  const currentTypeArr = cloneDeep(type);
  const currentType = currentTypeArr.find((it) => String(blog.typeId) === String(it.typeId));
  const currentTagIds = ((<unknown>blog.tagId) as string).split(",");
  const currentTagArray = currentTagArr.filter((it) => currentTagIds.includes(String(it.tagId!)));
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
