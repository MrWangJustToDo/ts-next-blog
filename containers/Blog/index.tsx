import dynamic from "next/dynamic";
import BlogHead from "components/BlogHead";
import { useUpdateBlogRead } from "hook/useBlog";
import BlogContentImg from "./blogContentImg";
import BlogContentType_Tag from "./blogContentType&Tag";
import BlogContentBody from "./blogContentBody";
import BlogContentLike from "./blogContentLike";
import BlogContentMessagePut from "./blogContentMessagePut";
import { BlogContentType } from "types/containers";

const BlogContentMessage = dynamic(() => import("./blogContentMessage"));

const Blog: BlogContentType = (props) => {
  const { blogImgLink, typeContent, tagContent, blogTitle, blogContent, blogId, blogOriginState, blogPriseState, blogCommentState, userId } = props;

  useUpdateBlogRead(blogId!);

  return (
    <div className="card user-select-none">
      <BlogHead {...props} />
      <ul className="list-group list-group-flush">
        <BlogContentImg src={blogImgLink!} />
        <BlogContentType_Tag typeContent={typeContent} tagContent={tagContent} blogOriginState={blogOriginState} />
        <BlogContentBody blogTitle={blogTitle} blogContent={blogContent} />
        <BlogContentLike blogId={blogId} blogPriseState={blogPriseState} userId={userId} />
        {blogCommentState ? <BlogContentMessage blogId={blogId!} /> : null}
        {blogCommentState ? <BlogContentMessagePut blogId={blogId!} /> : null}
      </ul>
    </div>
  );
};

export default Blog;
