import mergeWith from "lodash/mergeWith";
import cloneDeep from "lodash/cloneDeep";
import { BlogProps, ClientTagProps, HomeBlogProps, ServerTagProps, TypeProps, UserProps } from "types";

export function mergeTypeTagToBlog(
  blog: HomeBlogProps & UserProps,
  type: TypeProps[],
  tag: ServerTagProps[]
): HomeBlogProps & UserProps & TypeProps & ClientTagProps;

export function mergeTypeTagToBlog(blog: BlogProps & UserProps, type: TypeProps[], tag: ServerTagProps[]): BlogProps & UserProps & TypeProps & ClientTagProps;

export function mergeTypeTagToBlog(blog: (BlogProps & UserProps) | (HomeBlogProps & UserProps), type: TypeProps[], tag: ServerTagProps[]) {
  const currentTagArr = cloneDeep(tag);
  const currentTypeArr = cloneDeep(type);
  const currentType = currentTypeArr.find((it) => blog.typeId === it.typeId);
  const currentTagIds = blog.tagId.split(",");
  const currentTagArray = currentTagArr.filter((it) => currentTagIds.includes(it.tagId));
  let currentTag;
  if (currentTagArray.length > 1) {
    const head = currentTagArray.pop();
    currentTag = mergeWith(head, ...currentTagArray, (res: ServerTagProps[], srcValue: ServerTagProps) => {
      if (!Array.isArray(res)) {
        res = [res];
      }
      return res.concat(srcValue);
    });
  } else if (currentTagArray.length === 1) {
    const head = currentTagArray[0] as any;
    currentTag = Object.keys(head).reduce<any>((p, c) => {
      p[c] = [head[c]];
      return p;
    }, {}) as unknown as ClientTagProps;
  }
  return { ...blog, ...currentType, ...currentTag };
}