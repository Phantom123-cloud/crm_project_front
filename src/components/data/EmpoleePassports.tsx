import { useProtectedImage } from "@/hooks/useProtectedImage";
import { Image } from "antd";

type Props = {
  userId: string;
  passports: string[];
};

const PassportImage: React.FC<{ fileName: string }> = ({ fileName }) => {
  const imgUrl = useProtectedImage(fileName);
  return <Image src={imgUrl} />;
};

const EmployeePassports: React.FC<Props> = ({ userId, passports }) => {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {passports.map((fileName) => (
        <div className="bg-[#413f3f]">
          <PassportImage key={fileName} fileName={fileName} />
        </div>
      ))}
    </div>
  );
};

export default EmployeePassports;
