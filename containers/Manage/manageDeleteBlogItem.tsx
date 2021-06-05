import { useCallback } from "react";
import Link from "next/link";
import { mutate } from "swr";
import { apiName } from "config/api";
import { useUserRequest } from "hook/useUser";
import { flexCenter, getClass } from "utils/dom";
import { useFilterResult, useManageToDeleteModule } from "hook/useManage";
import { WithWriteBlogItem as SearchResult, BlogItem } from "components/BlogItem";
import ManageDeleteModule from "./manageDeleteModule";
import { BlogContentType } from "types/containers";
import { UseManageToDeleteModuleBody } from "types/hook";

import style from "./index.module.scss";

const ManageDeleteBlogItem: BlogContentType = (props) => {
  const filter = useFilterResult({ currentBlogId: props.blogId! });

  const request = useUserRequest({
    method: "delete",
    apiPath: apiName.deleteBlog,
    data: { blogId: props.blogId, typeId: props.typeId, tagId: props.tagId },
    header: { apiToken: true },
  });

  const successCallback = useCallback(() => {
    mutate(apiName.home);
    filter();
  }, [filter]);

  const body = useCallback<UseManageToDeleteModuleBody>(
    ({ request, item, successCallback }) =>
      (close) =>
        <ManageDeleteModule item={item} request={request} close={close} successCallback={successCallback} />,
    []
  );

  const click = useManageToDeleteModule({
    title: "确认删除博客",
    item: <BlogItem {...props} className={getClass("border rounded m-2", style.deleteBlogItem)} />,
    body,
    request,
    successCallback,
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
