import dynamic from "next/dynamic";
import BlogHead from "components/BlogHead";
import BlogContentImg from "./blogContentImg";
import BlogContentType_Tag from "./blogContentType&Tag";
import BlogContentBody from "./blogContentBody";
import BlogContentLike from "./blogContentLike";
import BlogContentMessagePut from "./blogContentMessagePut";
import { BlogContentType } from "types/containers";

let Blog: BlogContentType;

const BlogContentMessage = dynamic(() => import("./blogContentMessage"));

Blog = (props) => {
  const { blogImgLink, typeContent, tagContent, blogTitle, blogContent, blogId, blogOriginState, blogPriseState, blogCommentState } = props;

  return (
    <div className="card user-select-none">
      <BlogHead {...props} />
      <ul className="list-group list-group-flush">
        <BlogContentImg src={blogImgLink!} />
        <BlogContentType_Tag typeContent={typeContent} tagContent={tagContent} blogOriginState={blogOriginState} />
        <BlogContentBody blogTitle={blogTitle} blogContent={blogContent} />
        <BlogContentLike blogId={blogId} blogPriseState={blogPriseState} />
        {blogCommentState ? <BlogContentMessage blogId={blogId!} /> : null}
        {blogCommentState ? <BlogContentMessagePut blogId={blogId!} /> : null}
      </ul>
    </div>
  );
};

export default Blog;
