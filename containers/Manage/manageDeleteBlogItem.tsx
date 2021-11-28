import { useCallback } from "react";
import Link from "next/link";
import { mutate } from "swr";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/dom";
import { useUserRequest } from "hook/useUser";
import { useFilterResult, useManageToDeleteModule, UseManageToDeleteModuleBody } from "hook/useManage";
import { WithWriteBlogItem as SearchResult, BlogItem } from "components/BlogItem";
import { ManageDeleteModule } from "./manageDeleteModule";
import { ClientTagProps, HomeBlogProps, TypeProps, UserProps } from "types";

import style from "./index.module.scss";

export const ManageDeleteBlogItem = (props: HomeBlogProps & TypeProps & ClientTagProps & UserProps) => {
  const filter = useFilterResult({ currentBlogId: props.blogId! });

  const request = useUserRequest({
    cache: false,
    method: "delete",
    header: { apiToken: true },
    apiPath: apiName.deleteBlog,
    data: { blogId: props.blogId, typeId: props.typeId, tagId: props.tagId },
  });

  const successHandler = useCallback(() => {
    filter();
    mutate(apiName.home);
  }, [filter]);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ deleteItem }) => {
      const WithDelete = <ManageDeleteModule deleteItem={deleteItem} request={request} successHandler={successHandler} />;
      return WithDelete;
    },
    [request, successHandler]
  );

  const click = useManageToDeleteModule({
    body,
    title: "确认删除博客",
    deleteItem: <BlogItem {...props} className={getClass("border rounded w-100 m-2", style.deleteBlogItem)} />,
  });

  return (
    <>
      <SearchResult {...props} />
      <div className={getClass("position-absolute rounded", style.caverItem)}>
        <div className={getClass(flexCenter, "w-100 h-100")}>
          <Link href={`/editor/${props.blogId}`}>
            <a className="btn btn-primary btn-sm">编辑</a>
          </Link>
          <button className="btn btn-danger btn-sm ml-2" onClick={click}>
            删除
          </button>
        </div>
      </div>
    </>
  );
};
