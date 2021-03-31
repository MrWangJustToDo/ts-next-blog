import Link from "next/link";
import { mutate } from "swr";
import { WithWriteBlogItem as SearchResult, BlogItem } from "components/BlogItem";
import ManageDeleteModule from "./manageDeleteModule";
import { useUserRequest } from "hook/useUser";
import { flexCenter, getClass } from "utils/class";
import { BlogContentType } from "types/containers";

import style from "./index.module.scss";
import { apiName } from "config/api";
import { useFilterResult, useManageToDeleteModule } from "hook/useManage";
import { useCallback } from "react";
import { AutoRequestType } from "types/utils";

let ManageDeleteBlogItem: BlogContentType;

ManageDeleteBlogItem = (props) => {
  const filter = useFilterResult({ currentBlogId: props.blogId! });

  const request = useUserRequest({ method: "post", apiPath: apiName.deleteBlog, data: { blogId: props.blogId, typeId: props.typeId, tagId: props.tagId } });

  const body = useCallback<(request: AutoRequestType) => (item: JSX.Element) => (successCallback: () => void) => (close: () => void) => JSX.Element>(
    (request) => (item) => (successCallback) => (close) => <ManageDeleteModule item={item} request={request} close={close} successCallback={successCallback} />,
    []
  );

  const successCallback = useCallback(() => {
    mutate(apiName.home);
    filter();
  }, [filter]);

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
