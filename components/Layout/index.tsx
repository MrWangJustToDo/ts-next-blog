import dynamic from "next/dynamic";
import Head from "components/Head";
import Header from "components/Header";
import LoadingBar from "components/LoadingBar";
import ModuleManager from "components/ModuleManager";
import { useAutoLogin } from "hook/useUser";
import { animateFadein, getClass } from "utils/class";

const Footer = dynamic(() => import("../Footer"));

const Layout = ({ title, container = true, children }: { title?: string; container: boolean; children?: object }): JSX.Element => {
  useAutoLogin();

  return (
    <>
      <LoadingBar />
      <Head title={title} />
      <div className={getClass("d-flex flex-column", animateFadein)} style={{ minWidth: "320px" }}>
        <ModuleManager
          children={
            <>
              {container && <Header />}
              <div className="position-relative" style={{ minHeight: "calc(100vh - 120px)", zIndex: 1 }}>
                {children}
              </div>
              {container && <Footer />}
            </>
          }
        />
      </div>
    </>
  );
};

export default Layout;
