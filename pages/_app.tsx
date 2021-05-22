import React, { FC } from "react";
import { NextComponentType } from "next";
import { AppProps } from "next/app";
import { wrapper } from "store";
import Layout from "components/Layout";

import "../styles/globals.css";

type MyNextComponent = NextComponentType & { container?: boolean; title?: string; routerIn?: string; routerOut?: string };

interface MyAppProps extends AppProps {
  Component: MyNextComponent;
}

const WrappedApp: FC<MyAppProps> = ({ Component, pageProps }) => {
  return (
    <Layout title={Component.title} container={Component.container || true}>
      <Component {...pageProps} />
    </Layout>
  );
};

export type { MyNextComponent };

export default wrapper.withRedux(WrappedApp);
