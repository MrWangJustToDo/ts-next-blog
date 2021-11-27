import React, { useEffect } from "react";
import { useRouter } from "next/dist/client/router";
import { useLoadingBar } from "hook/useLoadingBar";
import { Bar } from "./loadingBar";
import { LoadingBarType } from "types/components";

export const LoadingBar: LoadingBarType = React.memo(function LoadingBar({ height = 1.5, present = 0 }) {
  const router = useRouter();

  const { start, end, ref } = useLoadingBar({ height, present });

  useEffect(() => {
    let id: NodeJS.Timeout | null = null;
    const delayStart = () => {
      id = setTimeout(start, 200);
    };
    const endNow = () => {
      id && clearTimeout(id) && (id = null);
      end();
    };
    router.events.on("routeChangeStart", delayStart);
    router.events.on("routeChangeComplete", endNow);
    return () => {
      router.events.off("routeChangeStart", delayStart);
      router.events.off("routeChangeComplete", endNow);
    };
  }, [end, start]);

  return <Bar forwardRef={ref} />;
});
