import { useProtectedImage } from "@/hooks/useProtectedImage";
import { Image } from "antd";

const PassportImage: React.FC<{ fileName: string }> = ({ fileName }) => {
  const imgUrl = useProtectedImage(fileName);
  return (
    <Image
      width={"100%"}
      src={imgUrl}
      height={400}
      style={{ objectFit: "fill" }}
    />
  );
};
export default PassportImage;
