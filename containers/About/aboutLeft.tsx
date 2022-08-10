import { Splide, SplideSlide } from "@splidejs/react-splide";
import { apiName } from "config/api";
import { usePinch } from "hook/usePinch";
import { Image } from "components/Image";
import { LoadRender } from "components/LoadRender";
import { SimpleElement } from "types/components";

export const AboutLeft: SimpleElement = () => {
  return (
    <div className="col-md-8">
      <div className="border rounded">
        <LoadRender<{ relativeUrl: string }[]>
          token
          apiPath={apiName.allImage}
          loaded={(data) => (
            <Splide >
              {[process.env.NEXT_PUBLIC_ABOUT].concat(data.map((it) => it.relativeUrl)).map((relativeUrl) => (
                <SplideSlide key={relativeUrl}>
                  <ImgItem relativeUrl={relativeUrl} />
                </SplideSlide>
              ))}
            </Splide>
          )}
          loading={() => <Image className="d-block rounded" src={process.env.NEXT_PUBLIC_ABOUT} width="100%" height="60%" layout="responsive" alt="me" />}
        />
      </div>
    </div>
  );
};

const ImgItem = ({ relativeUrl }: { relativeUrl: string }) => {
  const [pinchRef, coverRef] = usePinch<HTMLDivElement, HTMLDivElement>();

  return (
    <div className="d-block" ref={coverRef}>
      <div ref={pinchRef}>
        <Image className="d-block rounded" key={relativeUrl} src={relativeUrl} width="100%" height="60%" layout="responsive" alt={relativeUrl} />
      </div>
    </div>
  );
};
