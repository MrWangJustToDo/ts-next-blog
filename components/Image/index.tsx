import OriginalImage, { ImageProps } from "next/image";

const Image = (props: ImageProps) => {
  return <OriginalImage alt="" {...props} priority />;
};

export { Image };
