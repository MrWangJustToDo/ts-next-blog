import { useCallback } from "react";
import Link from "next/link";
import { mutate } from "swr";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/dom";
import { useUserRequest } from "hook/useUser";
import { useFilterResult, useManageToDeleteModule } from "hook/useManage";
import { WithWriteBlogItem as SearchResult, BlogItem } from "components/BlogItem";
import ManageDeleteModule from "./manageDeleteModule";
import { BlogContentType } from "types/containers";
import { UseManageToDeleteModuleBody } from "types/hook";

import style from "./index.module.scss";

const ManageDeleteBlogItem: BlogContentType = (props) => {
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
  }, []);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ deleteItem }) =>
      (closeHandler) =>
        <ManageDeleteModule deleteItem={deleteItem} request={request} closeHandler={closeHandler} successHandler={successHandler} />,
    []
  );

  const click = useManageToDeleteModule({
    body,
    title: "确认删除博客",
    deleteItem: <BlogItem {...props} className={getClass("border rounded m-2", style.deleteBlogItem)} />,
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

export default ManageDeleteBlogItem;
