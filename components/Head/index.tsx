// 全局的head组件
import OriginalHead from "next/head";

// Head 组件
export const Head = ({ title = "Blog" }: { title?: string }) => {
  return (
    <OriginalHead>
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#000000" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="this is my next blog" />
      <title>{title} | Blog</title>
      <link rel="icon" href="/favicon.ico" />
    </OriginalHead>
  );
};
