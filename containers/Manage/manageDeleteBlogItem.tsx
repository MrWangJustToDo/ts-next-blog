import { useCallback } from "react";
import Link from "next/link";
import { mutate } from "swr";
import { apiName } from "config/api";
import { flexCenter, getClass } from "utils/class";
import { useUserRequest } from "hook/useUser";
import { useFilterResult, useManageToDeleteModule } from "hook/useManage";
import { WithWriteBlogItem as SearchResult, BlogItem } from "components/BlogItem";
import ManageDeleteModule from "./manageDeleteModule";
import { AutoRequestType } from "types/utils";
import { BlogContentType } from "types/containers";

import style from "./index.module.scss";

let ManageDeleteBlogItem: BlogContentType;

ManageDeleteBlogItem = (props) => {
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

  const body = useCallback<
    ({ request, item, successCallback }: { request: AutoRequestType; item: JSX.Element; successCallback: () => void }) => (close: () => void) => JSX.Element
  >(
    ({ request, item, successCallback }) => (close) => <ManageDeleteModule item={item} request={request} close={close} successCallback={successCallback} />,
    []
  );

  const click = useManageToDeleteModule({
    title: "确认删除博客",
    item: <BlogItem {...props} className="border rounded m-2" _style={{ maxWidth: "600px" }} />,
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
