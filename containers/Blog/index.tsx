import dynamic from "next/dynamic";
import { BlogHead } from "components/BlogHead";
import { useUpdateBlogRead } from "hook/useBlog";
import { BlogContentImg } from "./blogContentImg";
import { BlogContentTypeAndTag } from "./blogContentTypeAndTag";
import { BlogContentBody } from "./blogContentBody";
import { BlogContentLike } from "./blogContentLike";
import { BlogContentMessagePut } from "./blogContentMessagePut";
import { BlogProps, ClientTagProps, TypeProps, UserProps } from "types";

const BlogContentMessage = dynamic<{ blogId: string }>(() => import("./blogContentMessage").then((r) => r.BlogContentMessage));

export const Blog = (props: BlogProps & UserProps & TypeProps & ClientTagProps) => {
  const { blogImgLink, typeContent, tagContent, blogTitle, blogContent, blogId, blogOriginState, blogPriseState, blogCommentState, userId } = props;

  // useUpdateBlogRead(blogId);

  return (
    <div className="card user-select-none">
      <BlogHead {...props} />
      <ul className="list-group list-group-flush">
        <BlogContentImg src={blogImgLink} />
        <BlogContentTypeAndTag typeContent={typeContent} tagContent={tagContent} blogOriginState={blogOriginState} />
        <BlogContentBody blogTitle={blogTitle} blogContent={blogContent} />
        <BlogContentLike blogPriseState={blogPriseState} userId={userId} />
        {blogCommentState ? <BlogContentMessage blogId={blogId} /> : null}
        {blogCommentState ? <BlogContentMessagePut blogId={blogId} /> : null}
      </ul>
    </div>
  );
};
