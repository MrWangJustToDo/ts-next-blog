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
      {/* 字体图标 */}
      <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
      {/* bootstrap */}
      <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.5.3/css/bootstrap.min.css" rel="stylesheet" />
      {/* animate css */}
      <link href="https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.min.css" rel="stylesheet" />
      {/* react slick */}
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
    </OriginalHead>
  );
};
