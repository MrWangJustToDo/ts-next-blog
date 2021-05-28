import React, { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import useLoadingBar from "hook/useLoadingBar";
import Bar from "./loadingBar";
import { LoadingBarType } from "types/components";

const LoadingBar: LoadingBarType = React.memo(({ height = 1.5, present = 0, loading = false }) => {
  const router = useRouter();

  const { start, end, autoAdd, state } = useLoadingBar({ height, present, loading });

  useEffect(() => {
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
    };
  }, []);
  
  return <Bar {...state} autoAdd={autoAdd} />;
});

export default LoadingBar;
