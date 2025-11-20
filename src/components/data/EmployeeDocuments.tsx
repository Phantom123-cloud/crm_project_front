import { Button, Badge } from "antd";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { useDownloadFile } from "@/hooks/useDownloadFile";
import { useDeleteFileMutation } from "@/app/services/files/filesApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { useLazyUserByIdQuery } from "@/app/services/users/usersApi";
import PassportImage from "../UI/PassportImage";
import FormPassportFiles from "../forms/FormPassportFiles";

type Props = {
  userId: string;
  passports: string[];
};

const EmployeeDocuments: React.FC<Props> = ({ userId, passports }) => {
  const { handleDownload } = useDownloadFile();
  const [deleteFile] = useDeleteFileMutation();
  const { callMessage } = useUiContext();
  const [triggerUserData] = useLazyUserByIdQuery();

  const onDeleteFile = async (fileName: string, userId: string) => {
    try {
      const { message } = await deleteFile({
        userId,
        fileName,
      }).unwrap();
      await triggerUserData(userId).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  return (
    <div>
      <FormPassportFiles userId={userId} />
      <div className="grid gap-4 justify-center grid-cols-1 2xl:grid-cols-3">
        {passports.map((fileName, index) => (
          <div className="p-2" key={fileName + index}>
            <div className="flex justify-center items-center code-box">
              <PassportImage fileName={fileName} />
            </div>
            <div className="flex justify-between items-center gap-4 mt-2">
              <Badge count={index + 1} />
              <div className="flex items-center gap-2">
                <Button
                  color="primary"
                  variant="solid"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    console.log(1);
                    handleDownload(fileName, userId);
                  }}
                >
                  Скачать
                </Button>
                <Button
                  color="danger"
                  variant="solid"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    onDeleteFile(fileName, userId);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDocuments;
