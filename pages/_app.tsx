import React, { FC } from "react";
import { NextComponentType } from "next";
import { AppProps } from "next/app";
import { wrapper } from "store";
import { Layout } from "components/Layout";

import "swiper/swiper.scss";

import "../styles/globals.css";

type MyNextComponent<T = {}> = NextComponentType<{}, {}, T> & { container?: boolean; title?: string; routerIn?: string; routerOut?: string };

interface MyAppProps extends AppProps {
  Component: MyNextComponent;
}

const WrappedApp: FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <Layout title={Component.title} container={Component.container}>
      <Component {...pageProps} />
    </Layout>
  );
};

export type { MyNextComponent };

export default wrapper.withRedux(WrappedApp);
