import Image from "next/image";
import { SimpleElement } from "types/components";

let AboutLeft: SimpleElement;

AboutLeft = () => {
  return (
    <div className="col-md-8">
      <Image className="border rounded" src={process.env.NEXT_PUBLIC_ABOUT} width="100%" height="65%" layout="responsive" />
    </div>
  );
};

export default AboutLeft;
