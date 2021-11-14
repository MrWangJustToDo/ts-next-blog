import { BlogProps, UserProps } from "types";
import { flexBetween, getClass } from "utils/dom";
import { BlogHeadLeft } from "./blogHeadLeft";
import { BlogHeadRight } from "./blogHeadRight";

export type BlogHeadProps = Pick<BlogProps, "blogModifyDate" | "blogModifyState" | "blogReadCount"> & Pick<UserProps, "avatar" | "gender" | "username">;

export const BlogHead = (props: BlogHeadProps) => {
  return (
    <h6 className={getClass("card-header bg-transparent", flexBetween)}>
      <BlogHeadLeft {...props} />
      <BlogHeadRight />
    </h6>
  );
};
