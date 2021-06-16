import Image from "next/image";
import Slick from "react-slick";
import { apiName } from "config/api";
import LoadRender from "components/LoadRender";
import { SimpleElement } from "types/components";

const AboutLeft: SimpleElement = () => {
  return (
    <div className="col-md-8">
      <div className="border rounded">
        <LoadRender<{ relativeUrl: string }[]>
          revalidateOnFocus={false}
          apiPath={apiName.allImage}
          loaded={(data) => (
            <Slick dots infinite speed={500} slidesToShow={1} slidesToScroll={1} lazyLoad="ondemand" autoplay>
              {[process.env.NEXT_PUBLIC_ABOUT].concat(data.map((it) => it.relativeUrl)).map((relativeUrl) => (
                <Image className="d-block rounded" key={relativeUrl} src={relativeUrl} width="100%" height="60%" layout="responsive" />
              ))}
            </Slick>
          )}
          loading={() => <Image className="d-block rounded" src={process.env.NEXT_PUBLIC_ABOUT} width="100%" height="60%" layout="responsive" />}
        />
      </div>
    </div>
  );
};

export default AboutLeft;
