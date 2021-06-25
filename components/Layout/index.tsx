import dynamic from "next/dynamic";
import Head from "components/Head";
import Header from "components/Header";
import LoadingBar from "components/LoadingBar";
import ModuleManager from "components/ModuleManager";
import { useAutoLogin, useAutoGetIp } from "hook/useUser";
import { getClass } from "utils/dom";

const Footer = dynamic(() => import("../Footer"));

const Layout = ({ title, container = true, children }: { title?: string; container?: boolean; children?: object }): JSX.Element => {
  useAutoLogin();
  useAutoGetIp();

  return (
    <>
      <LoadingBar />
      <Head title={title} />
      <ModuleManager>
        <div className={getClass("d-flex flex-column")} style={{ minWidth: "320px" }}>
          {container && <Header />}
          <div className="position-relative" style={{ minHeight: "calc(100vh - 120px)", zIndex: 1 }}>
            {children}
          </div>
          {container && <Footer />}
        </div>
      </ModuleManager>
    </>
  );
};

export default Layout;
