import Image, { ImageProps } from "next/image";

const MyImage = (props: ImageProps) => {
  return <Image {...props} />;
};

export default MyImage;
